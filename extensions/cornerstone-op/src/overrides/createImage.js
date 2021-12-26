/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 23, 2020 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { EVENTS } from '@onepacs/core';

let lastImageIdDrawn = '';

/**
 * Override cornerstoneWADOImageLoader.createImage for the following specific features:
 *  - Trigger decompression progress events (HV-94)
 *  - Force to calculate min/max pixel values even if they are defined in dicom header
 * @see https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/v3.1.0/src/imageLoader/createImage.js
 */
export function createImage(imageId, pixelData, transferSyntax, options) {
    const canvas = document.createElement('canvas');
    const imageFrameToDecode = cornerstoneWADOImageLoader.getImageFrame(imageId);

    //  HV-94 Let others know that the decompression is about to start
    cornerstone.triggerEvent(cornerstone.events, EVENTS.DECOMPRESS_PROGRESS, {
        imageId: options.viewportImageId,
        status: 'begin'
    });

    const decodePromise = cornerstoneWADOImageLoader.decodeImageFrame(imageFrameToDecode, transferSyntax, pixelData, canvas, options);

    return new Promise((resolve, reject) => {
        decodePromise.then((imageFrame) => {
            if (!imageFrame) {
                //  HV-94 Let others know that the decompression is failed
                cornerstone.triggerEvent(cornerstone.events, EVENTS.DECOMPRESS_PROGRESS, {
                    imageId: options.viewportImageId,
                    status: 'failed'
                });
                return;
            }

            //  HV-94 Let others know that the decompression is completed
            cornerstone.triggerEvent(cornerstone.events, EVENTS.DECOMPRESS_PROGRESS, {
                imageId: options.viewportImageId,
                status: 'end'
            });

            const imagePlaneModule = cornerstone.metaData.get('imagePlaneModule', imageId) || {};
            const voiLutModule = cornerstone.metaData.get('voiLutModule', imageId) || {};
            const modalityLutModule = cornerstone.metaData.get('modalityLutModule', imageId) || {};
            const sopCommonModule = cornerstone.metaData.get('sopCommonModule', imageId) || {};
            const isColorImage = cornerstoneWADOImageLoader.isColorImage(imageFrame.photometricInterpretation);

            // JPEGBaseline (8 bits) is already returning the pixel data in the right format (rgba)
            // because it's using a canvas to load and decode images.
            if (!cornerstoneWADOImageLoader.isJPEGBaseline8BitColor(imageFrame, transferSyntax)) {
                setPixelDataType(imageFrame);

                // convert color space
                if (isColorImage) {
                    // setup the canvas context
                    canvas.height = imageFrame.rows;
                    canvas.width = imageFrame.columns;

                    const context = canvas.getContext('2d');
                    const imageData = context.createImageData(imageFrame.columns, imageFrame.rows);

                    cornerstoneWADOImageLoader.convertColorSpace(imageFrame, imageData, transferSyntax);
                    imageFrame.imageData = imageData;
                    imageFrame.pixelData = imageData.data;
                }
            }

            const image = {
                imageId: options.viewportImageId,
                color: isColorImage,
                columnPixelSpacing: imagePlaneModule.pixelSpacing ? imagePlaneModule.pixelSpacing[1] : undefined,
                columns: imageFrame.columns,
                height: imageFrame.rows,
                intercept: modalityLutModule.rescaleIntercept ? modalityLutModule.rescaleIntercept : 0,
                invert: imageFrame.photometricInterpretation === 'MONOCHROME1',
                minPixelValue: imageFrame.smallestPixelValue,
                maxPixelValue: imageFrame.largestPixelValue,
                render: undefined, // set below
                rowPixelSpacing: imagePlaneModule.pixelSpacing ? imagePlaneModule.pixelSpacing[0] : undefined,
                rows: imageFrame.rows,
                sizeInBytes: imageFrame.pixelData.length,
                slope: modalityLutModule.rescaleSlope ? modalityLutModule.rescaleSlope : 1,
                width: imageFrame.columns,
                windowCenter: voiLutModule.windowCenter ? voiLutModule.windowCenter[0] : undefined,
                windowWidth: voiLutModule.windowWidth ? voiLutModule.windowWidth[0] : undefined,
                decodeTimeInMS: imageFrame.decodeTimeInMS,
                webWorkerTimeInMS: imageFrame.webWorkerTimeInMS
            };

            // add function to return pixel data
            image.getPixelData = () => imageFrame.pixelData;

            // Setup the renderer
            if (image.color) {
                image.render = cornerstone.renderColorImage;
                image.getCanvas = function () {
                    if (lastImageIdDrawn === imageId) {
                        return canvas;
                    }

                    canvas.height = image.rows;
                    canvas.width = image.columns;
                    const context = canvas.getContext('2d');

                    context.putImageData(imageFrame.imageData, 0, 0);
                    lastImageIdDrawn = imageId;

                    return canvas;
                };
            } else {
                image.render = cornerstone.renderGrayscaleImage;
            }

            //  HV-157 Force to calculate min/max pixel values even if they are defined in dicom header
            const minMax = cornerstoneWADOImageLoader.getMinMax(imageFrame.pixelData);
            image.minPixelValue = minMax.min;
            image.maxPixelValue = minMax.max;

            // Modality LUT
            if (modalityLutModule.modalityLUTSequence &&
                modalityLutModule.modalityLUTSequence.length > 0 &&
                isModalityLUTForDisplay(sopCommonModule.sopClassUID)) {
                image.modalityLUT = modalityLutModule.modalityLUTSequence[0];
            }

            // VOI LUT
            if (voiLutModule.voiLUTSequence &&
                voiLutModule.voiLUTSequence.length > 0) {
                image.voiLUT = voiLutModule.voiLUTSequence[0];
            }

            // set the ww/wc to cover the dynamic range of the image if no values are supplied
            if (image.windowCenter === undefined || image.windowWidth === undefined) {
                if (image.color) {
                    image.windowWidth = 255;
                    image.windowCenter = 128;
                } else {
                    const maxVoi = image.maxPixelValue * image.slope + image.intercept;
                    const minVoi = image.minPixelValue * image.slope + image.intercept;

                    image.windowWidth = maxVoi - minVoi;
                    image.windowCenter = (maxVoi + minVoi) / 2;
                }
            }
            resolve(image);
        }, reject);
    });
}

function isModalityLUTForDisplay(sopClassUid) {
    // special case for XA and XRF
    // https://groups.google.com/forum/#!searchin/comp.protocols.dicom/Modality$20LUT$20XA/comp.protocols.dicom/UBxhOZ2anJ0/D0R_QP8V2wIJ
    return sopClassUid !== '1.2.840.10008.5.1.4.1.1.12.1' // X-Ray Angiographic Image Storage
        && sopClassUid !== '1.2.840.10008.5.1.4.1.1.12.2.1'; // Enhanced XRF Image Storage
}

// Helper function to set pixel data to the right typed array.  This is needed because web workers
function setPixelDataType(imageFrame) {
    if (imageFrame.bitsAllocated === 16) {
        if (imageFrame.pixelRepresentation === 0) {
            imageFrame.pixelData = new Uint16Array(imageFrame.pixelData);
        } else {
            imageFrame.pixelData = new Int16Array(imageFrame.pixelData);
        }
    } else {
        imageFrame.pixelData = new Uint8Array(imageFrame.pixelData);
    }
}

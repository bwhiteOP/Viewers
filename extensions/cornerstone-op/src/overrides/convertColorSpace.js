/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 23, 2020 by Jay Liu
 */

import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { imageUtils } from '@onepacs/core';

/**
 * Override cornerstoneWadoImageLoader.convertColorSpace for the following specific features:
 *  - Convert RGB color by pixel if the image is compressed regardless planar configuration (HV-270)
 *  - Convert YBR_FULL color by pixel if the image is compressed regardless planar configuration (HV-270)
 * @see https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/v3.1.0/src/imageLoader/convertColorSpace.js
 */
export function convertColorSpace(imageFrame, imageData, transferSyntax) {
    const rgbaBuffer = imageData.data;
    // convert based on the photometric interpretation

    if (imageFrame.photometricInterpretation === 'RGB') {
        convertRGB(imageFrame, rgbaBuffer, transferSyntax);
    } else if (imageFrame.photometricInterpretation === 'YBR_RCT') {
        convertRGB(imageFrame, rgbaBuffer, transferSyntax);
    } else if (imageFrame.photometricInterpretation === 'YBR_ICT') {
        convertRGB(imageFrame, rgbaBuffer, transferSyntax);
    } else if (imageFrame.photometricInterpretation === 'PALETTE COLOR') {
        cornerstoneWADOImageLoader.convertPALETTECOLOR(imageFrame, rgbaBuffer);
    } else if (imageFrame.photometricInterpretation === 'YBR_FULL_422') {
        convertRGB(imageFrame, rgbaBuffer, transferSyntax);
    } else if (imageFrame.photometricInterpretation === 'YBR_FULL') {
        convertYBRFull(imageFrame, rgbaBuffer, transferSyntax);
    } else {
        throw new Error(`No color space conversion for photometric interpretation ${imageFrame.photometricInterpretation}`);
    }
}

function convertRGB(imageFrame, rgbaBuffer, transferSyntax) {
    if (shouldConvertByPixel(imageFrame, transferSyntax)) {
        cornerstoneWADOImageLoader.convertRGBColorByPixel(imageFrame.pixelData, rgbaBuffer);
    } else {
        cornerstoneWADOImageLoader.convertRGBColorByPlane(imageFrame.pixelData, rgbaBuffer);
    }
}

function convertYBRFull(imageFrame, rgbaBuffer, transferSyntax) {
    if (shouldConvertByPixel(imageFrame, transferSyntax)) {
        cornerstoneWADOImageLoader.convertYBRFullByPixel(imageFrame.pixelData, rgbaBuffer);
    } else {
        cornerstoneWADOImageLoader.convertYBRFullByPlane(imageFrame.pixelData, rgbaBuffer);
    }
}

function shouldConvertByPixel(imageFrame, transferSyntax) {
    if (imageFrame.planarConfiguration === 0) {
        return true;
    }

    if (transferSyntax !== '1.2.840.10008.1.2.5' /* RLE Lossless */ &&
        imageUtils.isCompressed(transferSyntax)) {
        return true;
    }

    return false;
}

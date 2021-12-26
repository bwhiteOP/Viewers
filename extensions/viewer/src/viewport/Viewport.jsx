/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 22, 2021 by Jay Liu
 */

/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { OHIFCornerstoneViewport } from '@ohif/extension-cornerstone';
import { showPresentationState } from '@onepacs/presentation-state';
import { ViewportOverlay } from './ViewportOverlay'
import { getApp } from '../ohif';
import { getImage, getElement } from '../utils';
import { useImageLoaded } from '../hooks';

const { commandsManager } = getApp();

/**
 * @typedef {{
 *  displaySet: types.DisplaySet,
 *  studies: types.OHIFStudy[],
 * }} ViewportData
 * 
 * @typedef {{
 *      StudyInstanceUID: string,
 *      SOPInstanceUID: string,
 *      frameIndex: number,
 *      activeViewportIndex: number,
 *      refreshViewports: boolean
 * }} JumpToImageData
 */

/**
 * @param {Object} props
 * @param {ViewportData} props.viewportData
 * @param {number} props.viewportIndex
 * @param {any[]} props.children
 */
export function Viewport(props) {
    const { viewportData } = props;

    /** @type {types.useState<JumpToImageData>} */
    const [currentImageData, setCurrentImageData] = useState();

    /** @type {types.useState<string>} */
    const [currentimageId, setCurrentImageId] = useState();
    const loadedImage = useImageLoaded(currentimageId);

    /** @param {JumpToImageData} imageData */
    const onNewImageHandler = imageData => {
        /** Do not trigger all viewports to render unnecessarily */
        imageData.refreshViewports = false;
        commandsManager.runCommand('jumpToImage', imageData);
    
        const { imageId } = getImage();
        setCurrentImageId(imageId);
        setCurrentImageData(imageData);
    };

    useEffect(() => {
        if (loadedImage && viewportData && currentImageData) {
            const element = getElement();
            const enabledElement = cornerstone.getEnabledElement(element);
        
            displayDICOMImageWhenLoaded(loadedImage, enabledElement);

            // Show the presentation state if it exist for this instance
            const presentationState = getPresentationState(viewportData, currentImageData);
            if (presentationState)
                showPresentationState(enabledElement, presentationState);
        }
    }, [loadedImage, viewportData, currentImageData])

    const customProps = { 
        className: 'OnePacsViewport',
        viewportOverlayComponent: ViewportOverlay
    };

    return (
        <OHIFCornerstoneViewport {...props}
            customProps={customProps}
            onNewImage={onNewImageHandler}
        />
    );
}

/**
 * This function loads the new DICOM image when image loaded for the specified imageId changes from WADO -> DICOM
 * @param {any} loadedImage
 * @param {any} enabledElement
 */
function displayDICOMImageWhenLoaded(loadedImage, enabledElement) {
    const { image: imageInElement } = enabledElement;

    // A new image had been loaded, no need to continue
    if (imageInElement.imageId !== loadedImage.imageId) return;

    // The same image from before, no need to continue
    if (imageInElement.wadoImage === loadedImage.wadoImage) return;

    // Don't need to call display image if it's wado
    if (loadedImage.wadoImage) return;

    // WADO and DICOM images have the same ID. So when the second DICOM image is loaded, we need
    // to call displayImage in order to update the enabledElement.image to the new one
    cornerstone.displayImage(enabledElement.element, loadedImage);
    commandsManager.runCommand('windowLevelDefault', {}, 'ACTIVE_VIEWPORT::CORNERSTONE');
}

/**
 * This function finds the image metadata in the viewport corresponding to the imageData.
 * @param {ViewportData} viewportData
 * @param {JumpToImageData} imageData
 * @returns {any} The presentation state for this instance
 */
function getPresentationState(viewportData, imageData) {
    const { studies: viewportStudies, displaySet: viewportDisplaySet } = viewportData;

    const study = viewportStudies.find(s => s.StudyInstanceUID === imageData.StudyInstanceUID);
    if (!study)
        return;

    const displaySet = study.displaySets.find(ds => ds.displaySetInstanceUID === viewportDisplaySet.displaySetInstanceUID);
    if (!displaySet)
        return;

    const image = displaySet.images.find(i => i.SOPInstanceUID === imageData.SOPInstanceUID);
    if (!image)
        return;

    return image.getCustomAttribute('PresentationState');
}

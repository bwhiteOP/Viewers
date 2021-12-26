/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

import OHIF from '@ohif/core';
import { getStackData } from './getStackData';

const { metadataProvider } = OHIF.cornerstone;

/**
 * Get the value of a DICOM tag for the current image in the stack.
 * @param {string} tag
 * @param {HTMLElement=} activeEnabledElement
 * @returns {*}
 */
export function getDicomTag(tag, activeEnabledElement) {
    const stackData = getStackData(activeEnabledElement);
    if (!stackData) return;

    const { currentImageIdIndex, imageIds } = stackData;
    const imageId = imageIds[currentImageIdIndex];
    const tagValue = metadataProvider.getTag(tag, imageId);
    return tagValue;
}

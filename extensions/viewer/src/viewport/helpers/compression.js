/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 31, 2021 by Jay Liu
 */

/**
 * Gets the compression status of the current image.
 * @param {Object} generalImageModule 
 * @param {*} image 
 * @returns {string}
 */
export function getCompression(generalImageModule, image) {
    const { lossyImageCompression, lossyImageCompressionRatio } = generalImageModule;

    //  HV-25 Show Lossy text if the compression is lossy
    if (lossyImageCompression === '01' &&
        lossyImageCompressionRatio !== '') {
        return 'LOSSY';
    }

    //  HV-138 Show Lossy text if it is wado image
    if (image && image.wadoImage) {
        return 'LOSSY PREVIEW';
    }

    return '';
}

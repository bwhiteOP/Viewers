/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 31, 2021 by Jay Liu
 */

/**
 * Gets the image dimension of the current image.
 * @param {*} imagePlaneModule 
 * @param {*} image 
 * @returns {string}
 */
export function getImageDimensions(imagePlaneModule, image) {
    const { rows, columns } = imagePlaneModule;

    if (rows && columns) {
        return `${columns} x ${rows}`
    }

    if (image && image.wadoImage) {
        return `${image.columns} x ${image.rows}`
    }

    return '';
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import { getBoundingImageCoordinates } from '../getBoundingImageCoordinates';

/**
  * Find the anchor point of the textbox based on the start/end handles.
  * @param {{x: number, y:number}} startHandle
  * @param {{x: number, y:number}} endHandle
  * @returns {Array.<{x: number, y: number}>}
  */
export function findTextBoxAnchorPoints(startHandle, endHandle) {
    const { left, top, width, height } = getBoundingImageCoordinates(
        startHandle,
        endHandle
    );

    return [
        {
        // Top middle point of ellipse
            x: left + width / 2,
            y: top,
        },
        {
        // Left middle point of ellipse
            x: left,
            y: top + height / 2,
        },
        {
        // Bottom middle point of ellipse
            x: left + width / 2,
            y: top + height,
        },
        {
        // Right middle point of ellipse
            x: left + width,
            y: top + height / 2,
        },
    ];
}

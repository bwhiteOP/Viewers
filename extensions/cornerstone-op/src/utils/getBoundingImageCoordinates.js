/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

/**
  * Retrieve the bounding image coordinates.
  * @param {{x: number, y: number}} startHandle
  * @param {{x: number, y: number}} endHandle
  * @returns {{ left: number, top: number, width: number, height: number }}
  */
export function getBoundingImageCoordinates(startHandle, endHandle) {
    return {
        left: Math.round(Math.min(startHandle.x, endHandle.x)),
        top: Math.round(Math.min(startHandle.y, endHandle.y)),
        width: Math.round(Math.abs(startHandle.x - endHandle.x)),
        height: Math.round(Math.abs(startHandle.y - endHandle.y)),
    };
}

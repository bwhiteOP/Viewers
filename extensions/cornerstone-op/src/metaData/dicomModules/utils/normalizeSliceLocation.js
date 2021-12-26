/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import cornerstoneMath from 'cornerstone-math';
import mathjs from 'mathjs';

/**
 * @typedef {Object} ImagePlaneModule
 * @prop {number} imagePlane.rowPixelSpacing
 * @prop {number} imagePlane.columnPixelSpacing
 * @prop {number} imagePlane.rows
 * @prop {number} imagePlane.columns
 * @prop {number[]} imagePlane.rowCosines
 * @prop {number[]} imagePlane.columnCosines
 * @prop {number[]} imagePlane.imagePositionPatient
 */

/**
 *
 * @param {ImagePlaneModule} imagePlane
 * @returns {string}
 */
export function normalizeSliceLocation(imagePlane) {
    if (!imagePlane || !imagePlane.rowCosines || !imagePlane.columnCosines) {
        return;
    }

    /** @type {types.Point} */
    const positionCenterPoint = {
        x: (imagePlane.columns - 1) / 2,
        y: (imagePlane.rows - 1) / 2
    };

    const rowCosinesVector = converToVector(imagePlane.rowCosines);
    const columnCosinesVector = converToVector(imagePlane.columnCosines);

    const normal = getNormalVector(rowCosinesVector, columnCosinesVector);
    const positionCenterOfImage = convertToPatient(
        rowCosinesVector,
        columnCosinesVector,
        imagePlane.rowPixelSpacing,
        imagePlane.columnPixelSpacing,
        converToVector(imagePlane.imagePositionPatient),
        positionCenterPoint
    );

    // Try to be a bit more specific when we have spatial information
    // by showing directional information (L, R, H, F, A, P) as well as
    // the slice location.
    const absX = Math.abs(normal.x);
    const absY = Math.abs(normal.y);
    const absZ = Math.abs(normal.z);

    let directionString;
    let location;

    // Get the primary direction based on the largest component of the normal.
    if (absZ >= absY && absZ >= absX) {
        // mostly axial because z >= x and y
        directionString = (positionCenterOfImage.z >= 0) ? 'H' : 'F';
        location = positionCenterOfImage.z;
    } else if (absY >= absX && absY >= absZ) {
        // mostly coronal because y >= x and z
        directionString = (positionCenterOfImage.y >= 0) ? 'P' : 'A';
        location = positionCenterOfImage.y;
    } else {
        // mostly sagittal because x >= y and z
        directionString = (positionCenterOfImage.x >= 0) ? 'L' : 'R';
        location = positionCenterOfImage.x;
    }

    return `${directionString}${Math.abs(location).toFixed(1)}`;
}

/**
 * @param {number[]} cosines
 * @returns {types.Vector3}
 */
function converToVector(cosines) {
    return {
        x: cosines[0],
        y: cosines[1],
        z: cosines[2]
    }

}

/**
 * @param {types.Vector3} v1
 * @param {types.Vector3} v2
 * @returns {types.Vector3}
 */
function getNormalVector(v1, v2) {
    const result = new cornerstoneMath.Vector3(v1.x, v1.y, v1.z);
    return result.cross(v2);
}

/**
 *
 * @param {types.Vector3} rowCosines
 * @param {types.Vector3} columnCosines
 * @param {number} rowPixelSpacing
 * @param {number} columnPixelSpacing
 * @param {types.Vector3} imagePositionPatient
 * @param {types.Point} positionCenterPoint
 * @returns {types.Vector3}
 */
function convertToPatient(
    rowCosines,
    columnCosines,
    rowPixelSpacing,
    columnPixelSpacing,
    imagePositionPatient,
    positionCenterPoint
) {

    // A shortcut for when the pixel position is (0, 0).
    if (positionCenterPoint.x === 0 && positionCenterPoint.y === 0) {
        return imagePositionPatient;
    }

    // Calculation of position in patient coordinates using
    // the matrix method described in Dicom PS 3.3 C.7.6.2.1.1.

    const pixelToPatientTransform = mathjs.matrix([
        [(rowCosines.x * columnPixelSpacing), (columnCosines.x * rowPixelSpacing), 0, imagePositionPatient.x],
        [(rowCosines.y * columnPixelSpacing), (columnCosines.y * rowPixelSpacing), 0, imagePositionPatient.y],
        [(rowCosines.z * columnPixelSpacing), (columnCosines.z * rowPixelSpacing), 0, imagePositionPatient.z],
        [0, 0, 0, 1]
    ]);

    const columnMatrix = mathjs.matrix([
        [positionCenterPoint.x],
        [positionCenterPoint.y],
        [0],
        [1]
    ]);

    const result = mathjs.multiply(pixelToPatientTransform, columnMatrix);

    return new cornerstoneMath.Vector3(result.get([0, 0]), result.get([1, 0]), result.get([2, 0]));
}

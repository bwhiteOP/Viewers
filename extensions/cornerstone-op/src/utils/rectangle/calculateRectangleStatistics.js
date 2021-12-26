/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

/**
 * Calculates the statistics of an elliptical region of interest.
 *
 * @private
 * @function calculateRectangleStatistics
 *
 * @param {number[]} sp - Array of the image data's pixel values.
 * @param {{ top, left, height, width }} rectangle An object describing the rectangle.
 * @returns {{
    *      count: number,
    *      mean: number,
    *      variance: number,
    *      stdDev: number,
    *      min?: number,
    *      max?: number
    * }}
    */
export function calculateRectangleStatistics(sp, rectangle) {
    let sum = 0;
    let sumSquared = 0;
    let count = 0;
    let index = 0;
    let min = sp ? sp[0] : null;
    let max = sp ? sp[0] : null;

    for (let y = rectangle.top; y < rectangle.top + rectangle.height; y++) {
        for (let x = rectangle.left; x < rectangle.left + rectangle.width; x++) {
            sum += sp[index];
            sumSquared += sp[index] * sp[index];
            min = Math.min(min, sp[index]);
            max = Math.max(max, sp[index]);
            count++; // TODO: Wouldn't this just be sp.length?
            index++;
        }
    }

    if (count === 0) {
        return {
            count,
            mean: 0.0,
            variance: 0.0,
            stdDev: 0.0,
            min: 0.0,
            max: 0.0,
        };
    }

    const mean = sum / count;
    const variance = sumSquared / count - mean * mean;

    return {
        count,
        mean,
        variance,
        stdDev: Math.sqrt(variance),
        min,
        max,
    };
}

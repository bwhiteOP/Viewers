/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

/**
 * Format number to a specified precision.
 * Copied from react-cornerstone-viewport
 * @see https://github.com/cornerstonejs/react-cornerstone-viewport/blob/v4.0.5/src/helpers/formatNumberPrecision.js
 * @param {string} numberString 
 * @param {number} precision 
 * @returns {string | undefined}
 */
export function formatNumberPrecision(numberString, precision) {
    if (numberString !== null) {
        return parseFloat(numberString).toFixed(precision);
    }
}

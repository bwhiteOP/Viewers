/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
const numbersWithCommas = cornerstoneTools.import('util/numbersWithCommas');

/**
 *
 * @param {string} prefix
 * @param {number} meanSUV
 * @param {number} stdDevSUV
 * @returns {string}
 */
export function formatSUV(prefix, meanSUV, stdDevSUV) {
    let meanSUVText = 'N/A';
    let stdDevSUVText = 'N/A';

    if (meanSUV !== undefined) {
        meanSUVText = numbersWithCommas(meanSUV.toFixed(2));
        stdDevSUVText = numbersWithCommas(stdDevSUV.toFixed(2));
    }

    return `${prefix}: Mean: ${meanSUVText}, StdDev: ${stdDevSUVText}`;
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
const numbersWithCommas = cornerstoneTools.import('util/numbersWithCommas');

/**
  * Format the specified area
  * @param {number} area
  * @param {*} hasPixelSpacing
  * @returns {string} The formatted label for showing area
  */
export function formatArea(area, hasPixelSpacing) {
    // This uses Char code 178 for a superscript 2
    const suffix = hasPixelSpacing
        ? ` mm${String.fromCharCode(178)}`
        : ` px${String.fromCharCode(178)}`;

    return `Area: ${numbersWithCommas(area.toFixed(2))}${suffix}`;
}

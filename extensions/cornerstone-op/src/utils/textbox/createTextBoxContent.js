/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import {
    formatArea,
    formatSUV,
    getUnit,
} from '../formatting';

const numbersWithCommas = cornerstoneTools.import('util/numbersWithCommas');

/**
  *
  *
  * @param {*} context
  * @param {*} isColorImage
  * @param {*} { area, mean, stdDev, min, max, meanStdDevSUV }
  * @param {*} modality
  * @param {*} hasPixelSpacing
  * @param {*} [options={}] - { showMinMax, showHounsfieldUnits }
  * @returns {string[]}
  */
export function createTextBoxContent(
    context,
    isColorImage,
    { area, mean, stdDev, min, max, meanStdDevSUV } = {},
    modality,
    hasPixelSpacing,
    options = {}
) {
    const showMinMax = options.showMinMax || false;

    const textLines = [];

    // Don't display mean/standardDev for color images
    if (!isColorImage) {
        const hasStandardUptakeValues = meanStdDevSUV && meanStdDevSUV.mean.bw !== 0;
        const unit = getUnit(modality, options.showHounsfieldUnits);

        let meanString = `Mean: ${numbersWithCommas(mean.toFixed(2))} ${unit}`;
        const stdDevString = `Std Dev: ${numbersWithCommas(stdDev.toFixed(2))} ${unit}`;

        // If this image has SUV values to display, concatenate them to the text line
        if (hasStandardUptakeValues) {

            if (options.showSUVBw) {
                textLines.push(formatSUV('SUV (bw, g/ml)', meanStdDevSUV.mean.bw, meanStdDevSUV.stdDev.bw));
            }

            if (options.showSUVBsa) {
                textLines.push(formatSUV('SUV (bsa, cm2/ml)', meanStdDevSUV.mean.bsa, meanStdDevSUV.stdDev.bsa));
            }

            if (options.showSUVLbm) {
                textLines.push(formatSUV('SUV (lbm, g/ml)', meanStdDevSUV.mean.lbm, meanStdDevSUV.stdDev.lbm));
            }
        }

        textLines.push(meanString);
        textLines.push(stdDevString);

        if (showMinMax) {
            let minString = `Min: ${min} ${unit}`;
            const maxString = `Max: ${max} ${unit}`;
            const targetStringLength = hasStandardUptakeValues
                ? Math.floor(context.measureText(`${stdDevString}     `).width)
                : Math.floor(context.measureText(`${meanString}     `).width);

            while (context.measureText(minString).width < targetStringLength) {
                minString += ' ';
            }

            textLines.push(`${minString}${maxString}`);
        }
    }

    textLines.push(formatArea(area, hasPixelSpacing));

    return textLines;
}

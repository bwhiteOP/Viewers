/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * August 6, 2021 by Jay Liu
 */

import { toolsMapping } from '@onepacs/cornerstone';

/**
 * Required by OHIF MeasurementApi to synchronize measurement with cornerstone tool.
 * Copy from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/core/src/measurements/tools/ellipticalRoi.js
 */
export const arrowAnnotate = {
    id: toolsMapping.annotate,
    cornerstoneToolType: toolsMapping.annotate,
    name: 'ArrowAnnotate',
    toolGroup: 'allTools',
    options: {
        measurementTable: {
            displayFunction,
        },
        caseProgress: {
            include: true,
            evaluate: true,
        },
    },
};

function displayFunction(data) {
    return data.text || '';
}


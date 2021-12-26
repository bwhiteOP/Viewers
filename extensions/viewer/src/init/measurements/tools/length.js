/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 03, 2020 by Jay Liu
 */

import { toolsMapping } from '@onepacs/cornerstone';
import { displayLength } from './displayFunctions';

/**
 * Required by OHIF MeasurementApi to synchronize measurement with cornerstone tool.
 * Copy from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/core/src/measurements/tools/length.js
 */
export const length = {
    id: toolsMapping.length,
    cornerstoneToolType: toolsMapping.length,
    name: 'Length',
    toolGroup: 'allTools',
    options: {
        measurementTable: {
            displayFunction: displayLength,
        },
        caseProgress: {
            include: true,
            evaluate: true,
        },
    },
};

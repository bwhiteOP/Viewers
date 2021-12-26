/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 03, 2020 by Jay Liu
 */

import { toolsMapping } from '@onepacs/cornerstone';
import { displayArea } from './displayFunctions';

/**
 * Required by OHIF MeasurementApi to synchronize measurement with cornerstone tool.
 * Copy from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/core/src/measurements/tools/rectangleRoi.js
 */
export const rectangleRoi = {
    id: toolsMapping.rectangleRoi,
    cornerstoneToolType: toolsMapping.rectangleRoi,
    name: 'Rectangle',
    toolGroup: 'allTools',
    options: {
        measurementTable: {
            displayFunction: displayArea,
        },
        caseProgress: {
            include: true,
            evaluate: true,
        },
    },
};

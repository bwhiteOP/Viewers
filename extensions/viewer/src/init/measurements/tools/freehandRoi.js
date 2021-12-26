/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * August 6, 2021 by Jay Liu
 */

import { toolsMapping } from '@onepacs/cornerstone';
import { displayArea } from './displayFunctions';

/**
 * Required by OHIF MeasurementApi to synchronize measurement with cornerstone tool.
 */
export const freehandRoi = {
    id: toolsMapping.freehandRoi,
    cornerstoneToolType: toolsMapping.freehandRoi,
    name: 'Freehand',
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

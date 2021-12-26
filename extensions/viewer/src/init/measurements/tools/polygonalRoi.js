/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * August 6, 2021 by Jay Liu
 */

import { toolsMapping } from '@onepacs/cornerstone';
import { displayArea } from './displayFunctions';

/**
 * Required by OHIF MeasurementApi to synchronize measurement with cornerstone tool.
 */
export const polygonalRoi = {
    id: toolsMapping.polygonalRoi,
    cornerstoneToolType: toolsMapping.polygonalRoi,
    name: 'Polygon',
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

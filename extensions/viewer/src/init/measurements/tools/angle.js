/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * August 6, 2021 by Jay Liu
 */

import { toolsMapping } from '@onepacs/cornerstone';
import { displayAngle } from './displayFunctions';

/**
 * Required by OHIF MeasurementApi to synchronize measurement with cornerstone tool.
 * Copy from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/core/src/measurements/tools/ellipticalRoi.js
 */
export const angle = {
    id: toolsMapping.angle,
    cornerstoneToolType: toolsMapping.angle,
    name: 'Angle',
    toolGroup: 'allTools',
    options: {
        measurementTable: {
            displayFunction: displayAngle,
        },
        caseProgress: {
            include: true,
            evaluate: true,
        },
    },
};

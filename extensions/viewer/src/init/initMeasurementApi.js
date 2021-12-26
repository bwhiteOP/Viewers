/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 03, 2020 by Jay Liu
 */

import _ from 'lodash';
import OHIF, { DICOMSR } from '@ohif/core';
import * as measurements from './measurements/tools';

const onepacsTools = Object.values(measurements);
const ohifTools = Object.values(OHIF.measurements.tools);
const toolGroupChildTools = _.groupBy([...ohifTools, ...onepacsTools], 'toolGroup');
const toolGroups = Object.keys(toolGroupChildTools).map(groupId => {
    return {
        id: groupId,
        name: 'Measurements',
        childTools: toolGroupChildTools[groupId],
        options: {
            caseProgress: {
                include: true,
                evaluate: true,
            }
        }
    };
});

export function initMeasurementApi() {
    const measurementApiConfig = {
        measurementTools: toolGroups,
        dataExchange: {
            retrieve: DICOMSR.retrieveMeasurements,
            store: DICOMSR.storeMeasurements,
        },
        server: {},
    };

    // Initialize measurementApi with tools
    OHIF.measurements.MeasurementApi.setConfiguration(measurementApiConfig);
}

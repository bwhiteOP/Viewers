/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 03, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import OHIF from '@ohif/core';
// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

const { setMeasurements } = OHIF.redux.actions;

/**
 * @param {types.OHIFStudy[]} studies
 * @param {boolean} isStudyLoaded
 * @param {Object | undefined} timepointApi
 * @returns {Object | undefined} measurementApi
 */
export function useMeasurementApi(studies, isStudyLoaded, timepointApi) {
    const dispatch = useDispatch();
    /** @type {types.useState<Object>} */
    const [measurementApi, setMeasurementApi] = useState();

    useEffect(() => {
        const instance = new OHIF.measurements.MeasurementApi(timepointApi, {
            onMeasurementsUpdated: measurements => dispatch(setMeasurements(measurements))
        });
        setMeasurementApi(instance);
    },
    [dispatch, timepointApi]);

    useEffect(() => {
        async function doAsync() {
            if (measurementApi && timepointApi && isStudyLoaded && studies) {
                const PatientID = studies[0]?.PatientID;
                await timepointApi.retrieveTimepoints({ PatientID });
                measurementApi.retrieveMeasurements(PatientID, [ timepointApi.currentTimepointId ]);
            }
        }

        doAsync();
    }, [studies, isStudyLoaded, timepointApi, measurementApi]);

    return measurementApi;
}

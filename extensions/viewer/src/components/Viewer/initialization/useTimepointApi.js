/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 03, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import OHIF from '@ohif/core';
// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

const { setTimepoints } = OHIF.redux.actions;
const currentTimepointId = 'TimepointId';

/**
 * @param {types.OHIFStudy[]} studies
 * @param {string[]} studyInstanceUIDs
 * @returns {Object | undefined} timepointApi
 */
export function useTimepointApi(studies, studyInstanceUIDs) {
    const dispatch = useDispatch();
    /** @type {types.useState<Object>} */
    const [timepointApi, setTimepointApi] = useState();

    useEffect(() => {
        // TimepointApi initialization
        OHIF.measurements.TimepointApi.setConfiguration({
            dataExchange: {
                retrieve,
                store,
                remove,
                update,
                disassociate,
            },
        });

        const instance = new OHIF.measurements.TimepointApi(currentTimepointId, {
            onTimepointsUpdated: timepoints => dispatch(setTimepoints(timepoints))
        });
        setTimepointApi(instance);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

    function retrieve(filter) {
        OHIF.log.info('retrieveTimepoints');

        // Get the earliest and latest study date
        let earliestDate = new Date().toISOString();
        let latestDate = new Date().toISOString();
        if (studies) {
            latestDate = new Date('1000-01-01').toISOString();
            studies.forEach(study => {
                const StudyDate = moment(study.StudyDate, 'YYYYMMDD').toISOString();
                if (StudyDate < earliestDate) {
                    earliestDate = StudyDate;
                }
                if (StudyDate > latestDate) {
                    latestDate = StudyDate;
                }
            });
        }

        // Return a generic timepoint
        return Promise.resolve([
            {
                timepointType: 'baseline',
                timepointId: 'TimepointId',
                studyInstanceUIDs,
                PatientID: filter.PatientID,
                earliestDate,
                latestDate,
                isLocked: false,
            },
        ]);
    }

    function store(timepointData) {
        OHIF.log.info('storeTimepoints');
        return Promise.resolve();
    }

    function update(timepointData, query) {
        OHIF.log.info('updateTimepoint');
        return Promise.resolve();
    }

    function remove(timepointId) {
        OHIF.log.info('removeTimepoint');
        return Promise.resolve();
    }

    function disassociate(timepointIds, StudyInstanceUID) {
        OHIF.log.info('disassociateStudy');
        return Promise.resolve();
    }

    return timepointApi;
}

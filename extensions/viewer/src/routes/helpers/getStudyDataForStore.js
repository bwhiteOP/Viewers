/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * Returns a subset of study data to be stored in redux store.
 * Alternatively, return the full study to store everything.
 * @param {types.OHIFStudy} study
 */
export function getStudyDataForStore(study) {
    return study;
    // return {
    //     StudyInstanceUID: study.StudyInstanceUID,
    //     series: study.series.map(s => ({
    //         SeriesInstanceUID: s.SeriesInstanceUID
    //     }))
    // };
}

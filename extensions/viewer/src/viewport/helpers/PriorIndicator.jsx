/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 03, 2021 by PoyangLiu
 */

/* eslint-disable react/prop-types */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getStudies } from '../../redux/selectors/studies'

const ONE_DAY = 1 * 24 * 60 * 60 * 1000;

export function PriorIndicator({ studyInstanceUID }) {
    const [priorText, setPriorText] = useState('');
    const { studyData } = useSelector(getStudies);
    const newestStudy = Object.values(studyData).reduce(getNewestStudy);
    const currentStudy = studyInstanceUID ? studyData[studyInstanceUID] : undefined;

    useEffect(() => {
        if (!currentStudy)
            return;

        // HV-309 - Allows the current study to be up to 1 day older than the newest prior before showing this warning.
        let text = newestStudy !== currentStudy && isOlderThan(currentStudy, newestStudy, ONE_DAY)
            ? '**Old study date**'
            : '';
    
        setPriorText(text);
    }, [currentStudy, newestStudy])

    return (
        <div className="priorIndicator">{priorText}</div>
    );
}

function isOlderThan(study1, study2, maxTimeDiff) {
    const dt1 = new Date(study1.StudyDateUTC).getTime();
    const dt2 = new Date(study2.StudyDateUTC).getTime();
    return (dt2 - dt1) > maxTimeDiff;
}

/**
 * @param {types.OHIFStudy} study1 
 * @param {types.OHIFStudy} study2 
 */
function getNewestStudy(study1, study2) {
    const dt1 = new Date(study1.StudyDateUTC);
    const dt2 = new Date(study2.StudyDateUTC);
    if (dt1 > dt2) {
        return study1;
    } else if (dt1 < dt2) {
        return study2;
    } else {
        return study1;
    }
}

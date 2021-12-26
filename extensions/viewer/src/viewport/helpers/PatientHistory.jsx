/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 02, 2021 by PoyangLiu
 */

/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import classnames from 'classnames';
import { Icon } from '../../components/Icon';

const patientHistoryCharLimit = 100;

/**
 * A component that show patient history in an expandable control if its length is greater than limit.
 * @see HV-466
 * @param {*} param 
 * @returns 
 */
export function PatientHistory({ patientHistory = '' }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isWithinLimit = patientHistory.length <= patientHistoryCharLimit;

    //  Shorten the patient history if it is out of limit
    const formattedText = isWithinLimit
        ? patientHistory
        : isExpanded
            ? patientHistory
            : `${patientHistory.substring(0, patientHistoryCharLimit)}...`;

    //  Make the patientHistory expandable div element if the patient history is out of limit
    const classNames = classnames('patientHistory', { 'expandable': !isWithinLimit });
    const expandoButton = isWithinLimit
        ? <></>
        : isExpanded
            ? <Icon name='caret-left' />
            : <Icon name='caret-right' />

    function handleClick() {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className={classNames} onClick={handleClick}>
            {formattedText}
            {expandoButton}
        </div>
    )
}

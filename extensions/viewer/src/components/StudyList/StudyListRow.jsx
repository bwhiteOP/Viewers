/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

import './StudyListRow.styl';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {{ data: types.GetStudiesResult, onClicked: (data: types.GetStudiesResult) => void } } param0
 */
function StudyListRow({ data, onClicked }) {
    const study = data.studiesToOpen[0].studies[0];
    const studyDate = moment.utc(study.studyDateUTC);
    return (
        <tr className="study-list-row"
            onClick={() => onClicked(data)}>

            <td className="column-patient">
                {study.patientName}
                <div className='secondary-text'>{study.patientId}</div>
            </td>
            <td className="column-description">
                {study.studyDescription}
            </td>
            <td className="column-modalities">
                {study.modalities.join('\\')}
            </td>
            <td className="column-studyDate">
                {studyDate.format('YYYY-MM-DD HH:mm:ss')}
            </td>
        </tr>
    );
}

StudyListRow.propTypes = {
    data: PropTypes.object.isRequired,
    onClicked: PropTypes.func.isRequired,
};

export default StudyListRow;

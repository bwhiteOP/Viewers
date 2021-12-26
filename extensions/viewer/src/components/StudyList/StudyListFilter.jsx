/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

import './StudyListFilter.styl';

import React from 'react';
import PropTypes from 'prop-types';

function StudyListFilter({ filter, onFilterChanged }) {
    return (
        <tr className='study-list-filter'>
            <th className='column-patient'>
                <label htmlFor='filter-patient'>Patient / MRN</label>
                <input type='text' id='filter-patient'
                    className='form-control studylist-search'
                    value={filter.patient}
                    onChange={e => onFilterChanged('patient', e.target.value)}
                />
            </th>
            <th className='column-description'>
                <label htmlFor='filter-description'>Description</label>
                <input type='text' id='filter-description'
                    className='form-control studylist-search'
                    value={filter.description}
                    onChange={e => onFilterChanged('description', e.target.value)}
                />
            </th>
            <th className='column-modalities'>
                <label htmlFor='filter-modalities'>Modalities</label>
                <input type='text' id='filter-modalities'
                    className='form-control studylist-search'
                    value={filter.modalities}
                    onChange={e => onFilterChanged('modalities', e.target.value)}
                />
            </th>
            <th className='column-studyDate'>
                <label htmlFor='filter-studyDate'>Date</label>
                <input type='text' id='filter-studyDate'
                    className='form-control studylist-search'
                    value={filter.studyDate}
                    onChange={e => onFilterChanged('studyDate', e.target.value)}
                />
            </th>
        </tr>
    );
}

StudyListFilter.propTypes = {
    filter: PropTypes.object.isRequired,
    onFilterChanged: PropTypes.func.isRequired
};

export default StudyListFilter

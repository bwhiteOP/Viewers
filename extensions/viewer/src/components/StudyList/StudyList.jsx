/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

import './StudyList.styl';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '@hooks';
import StudyListHeader from './StudyListHeader';
import StudyListFilter from './StudyListFilter';
import StudyListRow from './StudyListRow';

/**
 * @typedef {Object} Filter
 * @prop {string=} patient
 * @prop {string=} description
 * @prop {string=} modalities
 * @prop {string=} studyDate
 */

/**
 * @param {{ items: types.GetStudiesResult[], onSelectItem: (item: types.GetStudiesResult) => void } } param0
 */
export function StudyList({ items = [], onSelectItem }) {
    /** @type {types.useState<Filter>} */
    const [filter, setFilter] = useState({});
    const debouncedFilter = useDebounce(filter, 250);
    const filteredItems = items.filter(s => { return filterItem(s, debouncedFilter); });

    function onFilterChanged(field, value) {
        setFilter({
            ...filter,
            [field]: value
        });
    }

    return (
        <div className='onepacs-studylist'>
            <StudyListHeader count={filteredItems.length} total={items.length} />
            <div className='study-list-container'>
                <table className="table table--striped table--hoverable">
                    <thead className="table-head">
                        <StudyListFilter filter={filter} onFilterChanged={onFilterChanged} />
                    </thead>
                    <tbody className="table-body">
                        {
                            filteredItems.map((item, index) => (
                                <StudyListRow
                                    key={`${item.studiesToOpen[0].primaryStudyUid}-${index}`}
                                    data={item}
                                    onClicked={item => onSelectItem(item)} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

StudyList.propTypes = {
    items: PropTypes.array,
    onSelectItem: PropTypes.func
};

/**
 * @param {types.GetStudiesResult} item
 * @param {Filter} filter
 * @returns true|false
 */
function filterItem(item, filter) {
    let matches = true;
    const study = item.studiesToOpen[0].studies[0];

    function compare(ref, value) {
        if (ref === undefined || value === undefined) return true;
        return ref.toLowerCase().includes(value.toLowerCase());
    }

    matches = matches && compare(study.patientId, filter.patient)
            || compare(study.patientName, filter.patient);
    matches = matches && compare(study.studyDescription, filter.description);
    matches = matches && compare(study.modalities.join(','), filter.modalities);
    matches = matches && compare(study.studyDateUTC, filter.studyDate);

    return matches;
}

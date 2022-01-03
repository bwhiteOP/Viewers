/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 02, 2020 by Jay Liu
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Input} from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { isInteger } from 'lodash';

const RANGES = {
    rows: { min: 1, max: 4 },
    columns: { min: 1, max: 4 }
};

/**
 * @param {Object} param
 * @param {types.Layout} param.layout
 * @param {Function} param.onChanged
 */
export function LayoutRow({ layout, onChanged }) {
    const [state, setState] = useState(layout);
    const [error, setError] = useState({ rows: false, columns: false });

    function handleInputChange(event) {
        const $target = event.target;
        const { fieldname } = $target.dataset;
        const newState = {
            ...state,
            [fieldname]: $target.value
        };

        setState(newState);

        if (!isValid(newState.rows, RANGES.rows)) {
            setError({ ...error, rows: true });
            return;
        }

        if (!isValid(newState.columns, RANGES.columns)) {
            setError({ ...error, columns: true });
            return;
        }

        const updatedLayout = {
            modality: newState.modality,
            rows: clamp(newState.rows, RANGES.rows),
            columns: clamp(newState.columns, RANGES.columns)
        };

        onChanged(updatedLayout);
    }

    function renderInput(fieldname) {
        const range = RANGES[fieldname];
        return (
            <>
                <Input className="preferencesInput"
                    type="number" min={range.min} max={range.max}
                    value={state[fieldname]}
                    data-fieldname={fieldname}
                    onChange={handleInputChange}
                />
                {
                    error[fieldname]
                        ? <span className="preferencesInputErrorMessage">Invalid value</span>
                        : <></>
                }
            </>
        )
    }

    return (
        <div className="layoutRow">
            <div className="layoutColumn modality">{state.modality}</div>
            <div className="layoutColumn rows">{renderInput('rows')}</div>
            <div className="layoutColumn columns">{renderInput('columns')}</div>
        </div>
    );
}

/**
 * Check to see if a value is valid.
 * @param {*} value
 * @param {{ min: number, max: number}} range
 */
function isValid(value, range){
    /** @type {number} */
    const parsed = isInteger(value) ? value : parseInt(value);
    if (isNaN(parsed)) return false;
    return range.min <= parsed && parsed <= range.max;
}

/**
 * Clamp a value bewteen a range
 * @param {number} value
 * @param {{ min: number, max: number}} range
 */
function clamp(value, range){
    return Math.min(Math.max(value, range.min), range.max);
}

LayoutRow.propTypes = {
    layout: PropTypes.shape({
        modality: PropTypes.string.isRequired,
        rows: PropTypes.number.isRequired,
        columns: PropTypes.number.isRequired,
    }).isRequired,
    onChanged: PropTypes.func.isRequired,
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * @param {Object} param
 * @param {string} param.rowKey
 * @param {types.WLPreset} param.wlPreset
 * @param {Function} param.onChanged
 */
export function WindowLevelRow({ rowKey, wlPreset, onChanged }) {
    const [state, setState] = useState(wlPreset);

    function handleInputChange(event) {
        const $target = event.target;
        const { type } = $target;
        const { fieldname } = $target.dataset;
        const fieldValue = type === 'number' ? parseInt($target.value) : $target.value;
        const newState = {
            ...state,
            [fieldname]: fieldValue
        };

        setState(newState);
        onChanged(rowKey, newState);
    }

    function renderInput(fieldname, type = 'number') {
        return (
            <>
                <Input className="preferencesInput"
                    type={type}
                    value={state[fieldname]}
                    data-fieldname={fieldname}
                    onChange={handleInputChange}
                />
            </>
        )
    }

    return (
        <div className="wlRow">
            <div className="wlColumn preset">{parseInt(rowKey) + 1}</div>
            <div className="wlColumn description">{renderInput('id', 'string')}</div>
            <div className="wlColumn window">{renderInput('ww')}</div>
            <div className="wlColumn level">{renderInput('wc')}</div>
        </div>
    );
}

WindowLevelRow.propTypes = {
    rowKey: PropTypes.string.isRequired,
    wlPreset: PropTypes.shape({
        id: PropTypes.string,
        ww: PropTypes.number,
        wc: PropTypes.number,
    }).isRequired,
    onChanged: PropTypes.func.isRequired,
};

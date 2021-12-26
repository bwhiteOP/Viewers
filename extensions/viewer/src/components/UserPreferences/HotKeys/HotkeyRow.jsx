/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HotkeyField } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { MODIFIER_KEYS } from './hotkeysConfig';

/**
 * @typedef {(
 *      commandName: string,
 *      hotkey: types.HotkeyDefinition,
 *      newKeys: string[]
 *      ) => void
 * } HotkeyChanged
 */

/**
 * @param {Object} param
 * @param {string} param.commandName
 * @param {types.HotkeyDefinition} param.hotkey
 * @param {string} [param.errorMessage]
 * @param {HotkeyChanged} param.onChanged
 */
export function HotkeyRow({ commandName, hotkey, errorMessage, onChanged }) {
    const { label, keys } = hotkey;
    const className = classnames('wrapperHotkeyInput', errorMessage ? 'stateError' : '');

    const handleChange = newKeys => {
        onChanged(commandName, hotkey, newKeys);
    };

    return (
        <div key={commandName} className="hotkeyRow">
            <div className="hotkeyLabel">{label}</div>
            <div data-key="defaultTool" className={className} >
                <HotkeyField
                    keys={keys}
                    modifier_keys={MODIFIER_KEYS}
                    handleChange={handleChange}
                    classNames={'preferencesInput'}
                ></HotkeyField>
                <span className="preferencesInputErrorMessage">
                    {errorMessage}
                </span>
            </div>
        </div>
    )
}

HotkeyRow.propTypes = {
    commandName: PropTypes.string.isRequired,
    hotkey: PropTypes.shape({
        keys: PropTypes.arrayOf(PropTypes.string).isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
    errorMessage: PropTypes.string,
    onChanged: PropTypes.func.isRequired,
};

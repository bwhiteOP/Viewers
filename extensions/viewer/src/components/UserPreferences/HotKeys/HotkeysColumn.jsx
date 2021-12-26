/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { HotkeyRow } from './HotkeyRow';

/**
 * @param {Object} param
 * @param {types.Kvp<types.HotkeyDefinition>[]} param.hotkeys
 * @param {types.Dictionary<string>} param.errors
 * @param {import('./HotkeyRow').HotkeyChanged} param.onChanged
 */
export function HotkeyColumn({ hotkeys, errors, onChanged }) {

    return (
        <div className="hotkeyColumn">
            <div className="hotkeyHeader">
                <div className="headerItemText text-right">Function</div>
                <div className="headerItemText text-center">Shortcut</div>
            </div>
            {hotkeys.map(kvp => {
                const [commandName, hotkey] = kvp;
                const errorMesssage = errors[commandName];
                return (
                    <HotkeyRow key={commandName}
                        commandName={commandName}
                        hotkey={hotkey}
                        errorMessage={errorMesssage}
                        onChanged={onChanged}
                    />
                )
            })}
        </div>
    )
}

HotkeyColumn.propTypes = {
    hotkeys: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    onChanged: PropTypes.func.isRequired,
};

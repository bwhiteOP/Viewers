/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { HotkeysIdCommandMap } from './hotkeysMapping';
import _ from 'lodash';

/**
 * Update hotkeys definition using OnePacs hotkey preferences
 * @param {types.HotkeyDictionary} hotkeys
 * @param {types.HotKeysPreferences} hotkeyPreferences
 * @returns {types.HotkeyDictionary} updated hotkeys
 */
export function getHotkeysFromPreferences(hotkeys, hotkeyPreferences) {
    const updated = _.cloneDeep(hotkeys);

    Object.entries(hotkeyPreferences).forEach(entry => {
        const [oldId, preferKey] = entry;
        const commandName = HotkeysIdCommandMap[oldId];
        if (commandName && updated[commandName]) {
            updated[commandName].keys = [preferKey.toLowerCase()];
        }
    });

    return updated;
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { HotkeysCommandIdMap } from './hotkeysMapping';

/**
 * Convert hotkeys >definitions to OnePacs hotkeys preferences.
 * @param {types.HotkeyDictionary} hotkeys
 * @returns {types.HotKeysPreferences}
 */
export function getHotkeysAsPreferences(hotkeys) {
    /** @type {types.HotKeysPreferences} */
    const preferences = {};

    Object.entries(hotkeys).forEach(entry => {
        const [commandName, { keys }] = entry;
        const id = HotkeysCommandIdMap[commandName];
        if (id && keys.length > 0) {
            preferences[id] = keys[0]; // take the first one
        }
    });

    return preferences;
}

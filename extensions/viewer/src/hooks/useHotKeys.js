/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUserPreferences, getHotkeysAsPreferences } from '@onepacs/user';
import { getApp } from '../ohif';

const { hotkeysManager } = getApp();
const { actions } = reduxUserPreferences;

/**
 * A custom hook that gets and sets the hotkeys.
 * It obfuscate the source of the hotkey information.
 * @returns {[
 *      types.HotkeyDictionary,
 *      types.HotkeyCommand[],
 *      function(types.HotkeyDictionary): Promise<void>,
 * ]}
 */
export function useHotkeys() {
    const dispatch = useDispatch();
    const { hotkeyDefinitions, hotkeyDefaults } = hotkeysManager;

    /**
     * @param {types.HotkeyDictionary} newHotkeys
     * @returns {Promise<void>}
     */
    async function saveHotkeys(newHotkeys) {
        const userPrefernces = { 'hotKeys': getHotkeysAsPreferences(newHotkeys) };
        await dispatch(actions.saveUserPreferences(userPrefernces));
    }

    return [
        hotkeyDefinitions,
        hotkeyDefaults,
        saveHotkeys
    ];
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

import _ from 'lodash';
// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUserPreferences } from '@onepacs/user';
import { TOOLBAR_BUTTON_TYPES } from './constants';

const { getPreferences } = reduxUserPreferences.selectors;

/**
 * The Window Preset group button.
 * @param {Object} state state of the redux store.
 * @returns {types.ToolbarButton}
 */
export default function(state) {
    return {
        id: 'OP-WindowPresets',
        label: 'Presets',
        icon: 'level',
        tooltip: {
            title: 'Window/Level Preset Tool',
            description: 'Select a predefined window/level preset'
        },
        buttons: getWLPresetsButtons(state),
    };
}

/**
 * Gets a list of sub level buttons corresponding to the presets.
 * @param {Object} state state of the redux store.
 * @returns {types.ToolbarButton[]}
 */
function getWLPresetsButtons(state) {
    const wlPresets = getWindowPresets(state);
    if (!wlPresets) {
        return []; // no presets at this time
    }

    /** @type {types.ToolbarButton[]} */
    const buttons = [];

    buttons.push({
        id: 'OP-WLPresetDefault',
        label: 'Default',
        icon: 'reset',
        tooltip: {
            title: 'Default',
            description: 'Set to the default window level'
        },
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'windowLevelDefault'
    });

    wlPresets.forEach((preset, i) => {
        if (preset.id === undefined ||
            preset.wc === undefined ||
            preset.ww === undefined) {
            return;
        }

        const presetNumber = i + 1;
        buttons.push({
            id: `OP-WLPreset${presetNumber}`,
            label: preset.id,
            icon: 'level',
            tooltip: {
                title: preset.id,
                description: `Window ${preset.ww} Level ${preset.wc}`
            },
            type: TOOLBAR_BUTTON_TYPES.COMMAND,
            commandName: `windowLevelPreset${presetNumber}`,
        });
    });

    return buttons;
}


/**
 * Gets the window level presets from store
 * @param {Object} state state of the redux store.
 * @returns {types.WLPreset[] | undefined}
 */
function getWindowPresets(state) {
    const wlPresetsPreferences = getPreferences(state, 'wlPresets');
    if (wlPresetsPreferences === undefined)
        return undefined;

    return Object.values(wlPresetsPreferences);
}

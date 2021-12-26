/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import * as buttons from './buttons/mainButtons';
import leftMouseButtons from './buttons/leftMouseButtons';
import rightMouseButtons from './buttons/rightMouseButtons';
import wlPresetsButtons from './buttons/wlPresetsButtons';

/**
 * Get a list of toolbar button definitions.
 * Copied and modified from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/extensions/cornerstone/src/toolbarModule.js
 * @see https://docs.ohif.org/extensions/modules/toolbar.html#button-definitions
 * @param {*} state
 * @returns {types.ToolbarButton[]}
 */
function getToolbarButtons(state) {
    return [
        leftMouseButtons,
        rightMouseButtons,
        wlPresetsButtons(state),

        // missing report & document
        // missing reference line
        // missing Link
        buttons.layout,
        buttons.cine,
        buttons.reset,
        buttons.rotateR,
        buttons.previousDisplaySet,
        buttons.nextDisplaySet,
        buttons.flipH,
        buttons.flipV,
        // missing HP, Prev/Next Stage
        buttons.savePR,
        buttons.download,
        buttons.invert,
        buttons.clear,
        buttons.userPreferences,
        // buttons.bidirectional,
        buttons.exit2DMPR
    ];
}

/**
 * @param {types.ModuleFunctionParameters} params
 * @returns {types.ToolbarModule}
 */
export default function(params) {
    return {
        definitions: getToolbarButtons,
        defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE',
    };
}

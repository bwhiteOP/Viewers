/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

// @ts-ignore
import { utils } from '@ohif/core';
import { getActiveViewport } from './viewports';

/**
 * Whether user can navigate to the previous displayset in the current viewport.
 * @param {*} state
 * @returns {boolean}
 */
export function canNavigatePreviousDisplaySet(state) {
    return canNavigateDisplaySet(state, -1);
}

/**
 * Whether user can navigate to the next displayset in the current viewport.
 * @param {*} state
 * @returns {boolean}
 */
export function canNavigateNextDisplaySet(state) {
    return canNavigateDisplaySet(state, 1);
}

/**
 * Determines whether it is possible to navigate to the display set in the specified direction.
 * @param {*} state state of the redux store.
 * @param {number} direction 1 or -1
 */
function canNavigateDisplaySet(state, direction) {
    const { displaySetInstanceUID, StudyInstanceUID } = getActiveViewport(state) || {};
    const studyMetadata = utils.studyMetadataManager.get(StudyInstanceUID);
    if (!studyMetadata)
        return false;

    const allDisplaySets = studyMetadata.getDisplaySets();
    const currentDisplaySetIndex = allDisplaySets.findIndex(ds => ds.displaySetInstanceUID === displaySetInstanceUID);
    if (currentDisplaySetIndex < 0) {
        return false;
    }

    const newDisplaySetIndex = currentDisplaySetIndex + direction;
    const newDisplaySetData = allDisplaySets[newDisplaySetIndex];
    return newDisplaySetData !== undefined;
}

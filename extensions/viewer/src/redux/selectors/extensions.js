/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

/**
 * @typedef {{
 *  cineDialog?: { visible: boolean }
 * }} ExtensionsState
 */

export function getExtensions(state) {
    return /** @type {ExtensionsState} */ (state.extensions);
}

/**
 * Gets whether the CINE dialog is visible.
 * @param {*} state
 * @returns {boolean}
 */
export function getCineDialogVisible(state) {
    const { visible } = getExtensions(state).cineDialog || {};
    return visible;
}

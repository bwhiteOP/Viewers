/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 11, 2021 by Jay Liu
 */

import { getApp } from '../ohif';

const { commandsManager } = getApp();

/**
 * Get the element of the current cornerstone enabledElement data.
 * @param {string=} context
 * @returns {HTMLElement}
 */
export function getElement(context) {
    return commandsManager.runCommand('getActiveViewportEnabledElement', {}, context || 'ACTIVE_VIEWPORT::CORNERSTONE');
}

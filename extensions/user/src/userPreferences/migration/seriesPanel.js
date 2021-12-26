/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * This is a special migration code involving migrating preferences from the seriesPanel -> panel.
 * @param {types.UserPreferences} userPreferences
 * @returns {types.UserPreferences} the migrated preferences
 */
export function migrateSeriesPanelPreferences(userPreferences = {}) {
    const { panel, seriesPanel } = userPreferences;
    if (!seriesPanel)
        return userPreferences; // nothing to do. no seriesPanel preferences

    if (panel)
        return userPreferences; // nothing to do. panel preferences already created

    userPreferences.panel = {
        left: {
            isOpen: seriesPanel.isVisible,
            panel: seriesPanel.isVisible ? 'studies' : undefined
        }
    }

    return userPreferences;
}


/**
 * This is a special backward compatible code involving writing panel.series preferences back to seriesPanel preferences.
 * @param {types.UserPreferences} userPreferences
 * @returns {types.UserPreferences} the migrated preferences
 */
export function backportSeriesPanel(userPreferences) {
    const { panel } = userPreferences;
    if (!panel || !panel.left)
        return userPreferences; // nothing to do. no panel preferences being saved

    userPreferences.seriesPanel = {
        isVisible: panel.left.panel === 'studies' && panel.left.isOpen
    }

    return userPreferences;
}

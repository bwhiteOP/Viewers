/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 *
 * @param {types.MouseToolsetsPreferences} preferences
 * @param {types.MouseToolsetsPreferences} defaultPreferences
 * @returns {types.MouseToolsetsPreferences} migrated preferences
 */
export function migrateToolsetsPreferences(preferences, defaultPreferences) {
    if ('Left' in preferences) {
        // Migrate the old preferences
        return {
            activeIndex: 0,
            toolsets: [preferences]
        };
    }

    if (!preferences.toolsets || preferences.toolsets.length === 0) {
        // log.debug('Previous mouseToolsets has length 0, use default');
        return defaultPreferences;
    }

    return preferences;
}

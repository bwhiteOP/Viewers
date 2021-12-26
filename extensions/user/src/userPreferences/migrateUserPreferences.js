/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { getDefaultPreferences } from './getDefaultUserPreferences';
import {
    migrateSeriesPanelPreferences,
    migrateToolsetsPreferences
} from './migration';

/**
 * Returns the migrated preferences.
 * @param {types.UserPreferences} userPreferences
 * @returns {types.UserPreferences} the migrated preferences
 */
export function migrateUserPreferences(userPreferences = {}) {

    Object.keys(userPreferences).forEach((/** @type {keyof types.UserPreferences} */ key) => {
        const preferences = userPreferences[key];
        const defaultPreferences = getDefaultPreferences(key);

        if (!preferences) {
            // @ts-ignore
            userPreferences[key] = defaultPreferences;
            return;
        }

        switch (key) {
            case 'mouseToolsets': {
                // @ts-ignore
                const migrated = migrateToolsetsPreferences(preferences, defaultPreferences);
                userPreferences[key] = migrated;
                break;
            }

            default:
                break; // do nothing
        }

    });

    migrateSeriesPanelPreferences(userPreferences);
    return userPreferences;
}

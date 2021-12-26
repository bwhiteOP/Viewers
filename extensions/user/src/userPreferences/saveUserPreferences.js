/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, routes, postAsync } from '@onepacs/core';
import { backportSeriesPanel } from './migration';

/**
 * Save User Preferences in OnePacs Server
 * @param {types.UserIdentity} userIdentity
 * @param {types.UserPermissions} userPermissions
 * @param {types.UserPreferences} preferences - The user preferences to be saved
 * @returns {Promise<void>} whether save is successful.
 */
export async function saveUserPreferences(userIdentity, userPermissions, preferences) {

    //  Get userIdentity to be used in the request to save user preferences
    if (!userIdentity) {
        throw new Error('Could not find userIdentity to save user preferences');
    }

    //  HV-194 Skip if disabled in the user permissions
    if (userPermissions && !userPermissions.allowUserPreferences) {
        return;
    }

    preferences = backportSeriesPanel(preferences);

    /** @type {types.SaveUserPreferencesRequest} */
    const request = {
        userIdentity: userIdentity,
        preferencesToSave: preferences
    };

    /** @type {{ result?: types.SaveUserPreferencesResult, error?: Error }} */
    const { result, error } = await postAsync(routes.server.api.saveUserPreferences, request);

    if (error) {
        throw error;
    }

    if (!result.success) {
        throw new Error('Failed to retrieve user preferences');
    }
}

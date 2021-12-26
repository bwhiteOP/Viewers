/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, postAsync, routes, arrayUtils } from '@onepacs/core';
import { getUserPreferences } from './redux/selectors';
import { migrateUserPreferences } from './migrateUserPreferences';
import { userPreferencesKeys } from './userPreferencesKeys';
import _ from 'lodash';

/**
 * Retrieve user preferences from server
 * @param {types.UserIdentity} userIdentity
 * @param {types.UserPermissions} [userPermissions]
 * @param {(keyof types.UserPreferences)[]} [keysToRetrieve] - The keys to retrieve user preferences. Leave empty to retrieve all.
 * @returns {Promise<types.UserPreferences>} The preferences matching the keys
 */
export async function retrieveUserPreferences(userIdentity, userPermissions, keysToRetrieve) {

    // Get userIdentity to be used in the request to retrieve user preferences
    if (!userIdentity) {
        throw new Error('userIdentity is needed to retrieve user preferences');
    }

    //  HV-194 Skip if disabled in the user permissions
    if (userPermissions && !userPermissions.allowUserPreferences) {
        return {};
    }

    const retrieveAll = keysToRetrieve === undefined || keysToRetrieve.length === 0;
    const state = getUserPreferences();
    if (!retrieveAll && includesAll(state, keysToRetrieve)) {
        //  HV-243 Use the cache if possible if already retrieved.
        return _.pick(state, keysToRetrieve);
    }

    const route = routes.server.api.retrieveUserPreferences;

    /** @type {types.RetrieveUserPreferencesRequest} */
    const request = {
        userIdentity: userIdentity,
        keysToRetrieve: retrieveAll ? userPreferencesKeys : keysToRetrieve
    };

    /** @type {{ result?: types.RetrieveUserPreferencesResult, error?: Error }} */
    const { result, error } = await postAsync(route, request);
    if (error) {
        throw error;
    }

    if (!result.success) {
        throw new Error('Failed to retrieve user preferences');
    }

    return migrateUserPreferences(result.preferences);
}

/**
 * Determines whether the object contains all the keys.
 * @param {string[]} keys
 */
function includesAll(object, keys) {
    return arrayUtils.includes(Object.keys(object), keys);
}

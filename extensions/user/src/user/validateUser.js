/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 09, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, log, routes, postAsync } from '@onepacs/core';

/**
 * Validate the current user identity with OnePacs server to see if it is still valid.
 * @param {types.UserIdentity} userIdentity
 * @returns {Promise<boolean>}
 */
export async function validateUser(userIdentity) {
    if (!userIdentity) {
        return false;
    }

    const route = routes.server.api.checkUserToken;

    /** @type {types.CheckUserTokenRequest} */
    const request = {
        userIdentity: userIdentity
    };

    /** @type {{ result?: types.CheckUserTokenResult, error?: Error }} */
    const { result, error } = await postAsync(route, request);

    if (error) {
        log.error(`Error when fetching from ${route}`, error);
        throw error;
    }

    return result?.success;
}

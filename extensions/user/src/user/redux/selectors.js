/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 09, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, getState } from '@onepacs/core';
import { Status } from './constants';
import { defaultState } from './state';

/**
 * @param {*} [state]
 * @returns {import('./state').UserState}
 **/
export function getUserState(state) {
    // @ts-ignore
    const userState = (state || getState())?.user || defaultState;
    return userState;
}

/**
 * @param {*} [state]
 * @returns {types.User}
 */
export function getUser(state) {
    return getUserState(state)?.payload;
}

/**
 * @param {*} [state]
 * @returns {boolean}
 */
export function isUserExpired(state) {
    const user = getUser(state);
    if (!user || !user.identity) {
        // user doesn't exist yet. No expiry
        return false;
    }

    const userState = getUserState(state);
    if ([Status.EXPIRED, Status.FAILED].includes(userState.status)) {
        return true;
    }

    if (userState.expiredOn) {
        const now = Date.now();
        const expiredOn = Date.parse(userState.expiredOn);
        return now > expiredOn;
    }

    return false;
}

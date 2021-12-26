/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

import { publicSettings } from '@onepacs/core';
import { Status, ActionTypes } from './constants';
import { defaultState } from './state';
import _ from 'lodash';

const user = (state = defaultState, action) => {
    const cachedSettings = publicSettings.cached();

    switch (action.type) {
        case ActionTypes.LOADING_USER:
            return _.merge({}, state, {
                status: Status.LOADING,
                error: undefined
            });

        case ActionTypes.SET_USER: {
            const now = new Date();
            const expiredOn = extendsByMinutes(now, cachedSettings.SessionTimeoutInMin);
            return _.mergeWith({}, state, {
                status: Status.SUCCESS,
                lastUpdated: now.toISOString(),
                expiredOn: expiredOn.toISOString(),
                payload: {
                    identity: action.user.identity,
                    permissions: action.user.permissions,
                }
            }, customizer);
        }
        case ActionTypes.LOAD_USER_FAILED:
            return _.merge({}, state, {
                status: Status.FAILED,
                error: action.error.message
            });

        case ActionTypes.VALIDATING_USER:
            return _.merge({}, state, {
                status: Status.VALIDATING,
                error: undefined
            });

        case ActionTypes.VALIDATE_USER_SUCCESS: {
            const now = new Date();
            const expiredOn = extendsByMinutes(now, cachedSettings.SessionTimeoutInMin);
            return _.mergeWith({}, state, {
                status: Status.SUCCESS,
                lastUpdated: now.toISOString(),
                expiredOn: expiredOn.toISOString(),
            }, customizer);
        }
        case ActionTypes.VALIDATE_USER_FAILED:
            return _.merge({}, state, {
                status: Status.FAILED,
                error: action.error.message
            });

        case ActionTypes.EXPIRE_USER:
            return _.merge({}, state, {
                status: Status.EXPIRED,
                expiredOn: new Date().toISOString(),
            });

        default:
            return state;
    }
};

/**
 * Customize how merge work
 * @param {*} target
 * @param {*} source
 */
function customizer(target, source) {
    // Replace array instead of merging them.
    if (_.isArray(target)) {
        return source;
    }
}

function extendsByMinutes(date, minutes) {
    const MILLISECONDS_PER_MINUTE = 60 * 1000;
    return new Date(date.getTime() + minutes * MILLISECONDS_PER_MINUTE);
}

export const reducers = {
    user
};

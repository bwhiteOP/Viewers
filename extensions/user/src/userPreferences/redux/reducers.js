/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

import { ActionTypes, Status } from './constants';
import { defaultState } from './state';
import _ from 'lodash';

const userPreferences = (state = defaultState, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_USER_PREFERENCES_REQUESTED:
            return _.merge({}, state, {
                status: Status.LOADING,
                error: undefined
            });

        case ActionTypes.LOAD_USER_PREFERENCES_SUCCESS:
            return _.mergeWith({}, state, {
                status: Status.SUCCESS,
                updatedCount: state.updatedCount+1,
                lastUpdated: new Date().toISOString(),
                payload: action.preferences,
            }, customizer);

        case ActionTypes.LOAD_USER_PREFERENCES_FAILED:
            return _.merge({}, state, {
                status: Status.FAILED,
                error: action.error.message
            });

        case ActionTypes.SAVE_USER_PREFERENCES_REQUESTED:
            return _.merge({}, state, {
                status: Status.SAVING,
                error: undefined
            });

        case ActionTypes.SAVE_USER_PREFERENCES_SUCCESS:
            return _.mergeWith({}, state, {
                status: Status.SUCCESS,
                updatedCount: state.updatedCount+1,
                lastUpdated: action.timestamp,
                payload: action.preferences,
            }, customizer);

        case ActionTypes.SAVE_USER_PREFERENCES_FAILED:
            return _.merge({}, state, {
                status: Status.FAILED,
                error: action.error.message
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

export const reducers = {
    userPreferences
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

import { redux as ohifRedux } from '@ohif/core';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { ActionTypes, Status } from './constants';
import { getUserPreferencesState } from './selectors';
import { saveUserPreferences as saveAsync } from '../saveUserPreferences';
import { retrieveUserPreferences as loadAsync } from '../retrieveUserPreferences';

import { getUser } from '../../user/redux/selectors';

const { actions: ohifActions } = ohifRedux;

/** @type {Promise<types.UserPreferences>} */
let lastDispatch;

/** @typedef {import('./state').UserPreferencesState} UserPreferencesState */

/**
 * Load user preferences.
 * Wait for an in-flight request if exist.
 * Use cached preferenced if it had been loaded at least once.
 */
const loadUserPreferencesIfNeeded = () => {
    return function (dispatch, getState) {
        const userPreferencesState = getUserPreferencesState(getState());
        const { status, updatedCount } = userPreferencesState;

        switch (status) {
            case Status.INITIAL:
            case Status.INVALID:
                lastDispatch = dispatch(loadUserPreferences());
                return lastDispatch;

            case Status.LOADING:
                // loading in flight, use the lastDispatch
                return lastDispatch;

            case Status.FAILED:
                if (updatedCount > 0) {
                    // resolve last loaded user preferences
                    return Promise.resolve(userPreferencesState.payload);
                } else {
                    lastDispatch = dispatch(loadUserPreferences());
                    return lastDispatch;
                }

            case Status.SAVING:
            case Status.SUCCESS:
                // already loaded, resolve immediately
                return Promise.resolve(userPreferencesState.payload);
        }
    }
}

const loadUserPreferences = () => {
    return async function (dispatch, getState) {
        dispatch(loadUserPreferencesRequested());

        try {
            const user = getUser(getState());
            const preferences = await loadAsync(user.identity, user.permissions)
            dispatch(loadUserPreferencesSuccess(preferences));

            const windowLevelData = convertToWindowLevelData(preferences.wlPresets);
            if (windowLevelData)
                dispatch(ohifActions.setUserPreferences({ windowLevelData }));

            // server may only returns a partial set.
            // get the state again so we get the full user preferences
            const userPreferencesState = getUserPreferencesState(getState());
            return userPreferencesState.payload;
        } catch (error) {
            dispatch(loadUserPreferencesFailed(error));
            throw error;
        }
    }
}

const loadUserPreferencesRequested = () => ({
    type: ActionTypes.LOAD_USER_PREFERENCES_REQUESTED,
});

/** @param {types.UserPreferences} preferences */
const loadUserPreferencesSuccess = (preferences) => ({
    type: ActionTypes.LOAD_USER_PREFERENCES_SUCCESS,
    preferences,
});

/** @param {Error} error */
const loadUserPreferencesFailed = error => ({
    type: ActionTypes.LOAD_USER_PREFERENCES_FAILED,
    error,
});

/**
 * @param {types.UserPreferences} preferences
 */
const saveUserPreferences = preferences => {
    return async function (dispatch, getState) {
        // Updated the store to inform that the API call is starting.
        dispatch(saveUserPreferencesRequested(preferences));

        try {
            const user = getUser(getState());
            await saveAsync(user.identity, user.permissions, preferences)
            dispatch(saveUserPreferencesSuccess(preferences));

            const windowLevelData = convertToWindowLevelData(preferences.wlPresets);
            if (windowLevelData)
                dispatch(ohifActions.setUserPreferences({ windowLevelData }));
        } catch (error) {
            dispatch(saveUserPreferencesFailed(error));
            throw error;
        }
    }
}

/** @param {types.UserPreferences} preferences */
const saveUserPreferencesRequested = preferences => ({
    type: ActionTypes.SAVE_USER_PREFERENCES_REQUESTED,
    preferences
});

/** @param {types.UserPreferences} preferences */
const saveUserPreferencesSuccess = preferences => ({
    type: ActionTypes.SAVE_USER_PREFERENCES_SUCCESS,
    preferences,
});

/** @param {Error} error */
const saveUserPreferencesFailed = error => ({
    type: ActionTypes.SAVE_USER_PREFERENCES_FAILED,
    error,
});

/**
 * Convert userPreferences.wlPresets into OHIF's preferences.windowLevelData
 * @param {types.WLPresetsPreferences} wlPresets
 */
function convertToWindowLevelData(wlPresets) {
    if (!wlPresets) return;

    const windowLevelData = {};
    Object.keys(wlPresets).forEach(key => {
        const ohifPreKey = parseInt(key) + 1; // OHIF key is 1-based
        const wlPreset = wlPresets[key];
        windowLevelData[ohifPreKey] = {
            description: wlPreset.id,
            window: wlPreset.ww,
            level: wlPreset.wc
        };
    });

    return windowLevelData;
}

export const actions = {
    saveUserPreferences,
    loadUserPreferences,
    loadUserPreferencesIfNeeded
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, getState } from '@onepacs/core';
import { Status } from './constants';
import { defaultState } from './state';

/**
 * @param {*} [state]
 * @returns {import('./state').UserPreferencesState}
 */
export function getUserPreferencesState(state) {
    // @ts-ignore
    const userPreferencesState = (state || getState())?.userPreferences || defaultState;
    return userPreferencesState;
}

/**
 * @param {*} [state]
 * @returns {types.UserPreferences}
 */
export function getUserPreferences(state) {
    return getUserPreferencesState(state).payload;
}

/**
 * @template {keyof types.UserPreferences} T
 * @param {*} state
 * @param {T} key
 * @returns {types.UserPreferences[key]}
 */
export function getPreferences(state, key) {
    const userPreferences = getUserPreferences(state);
    return userPreferences[key];
}

/**
 * @param {*} [state]
 * @returns {boolean}
 */
export function isUserPreferencesFirstLoaded(state) {
    const userPreferencesState = getUserPreferencesState(state);
    return userPreferencesState.status === Status.SUCCESS
        && userPreferencesState.updatedCount === 1;
}

/**
 * @param {*} [state]
 * @returns {boolean}
 */
export function isUserPreferencesLoaded(state) {
    const userPreferencesState = getUserPreferencesState(state);
    return userPreferencesState.status === Status.SUCCESS
        && userPreferencesState.updatedCount > 0;
}

export const selectors = {
    isUserPreferencesFirstLoaded,
    isUserPreferencesLoaded,
    getUserPreferences,
    getPreferences
};

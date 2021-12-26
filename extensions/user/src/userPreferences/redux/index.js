/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { actions } from './actions';
import { selectors } from './selectors';
import { defaultState } from './state';

export const reduxUserPreferences = {
    actions,
    selectors,
    defaultState
};

/**
 * This is a convenience method when userPreferences is needed
 * outside of react components where there is no easy access to the redux store.
 * @template {keyof types.UserPreferences} T
 * @param {T} key
 * @param {types.UserPreferences[key]} key
 */
export function getPreferences(key) {
    return selectors.getPreferences(undefined, key);
}

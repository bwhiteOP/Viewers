/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 09, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { Status } from './constants';
import { getDefaultUserPreferences } from '../getDefaultUserPreferences';

/**
 * @typedef {{
 *      status: string,
 *      updatedCount: number,
 *      lastUpdated?: string,
 *      error?: string,
 *      payload: types.UserPreferences
 *  }} UserPreferencesState
 */

/** @type {UserPreferencesState} */
export const defaultState = {
    status: Status.INITIAL,
    updatedCount: 0,
    lastUpdated: undefined,
    error: undefined,
    payload: getDefaultUserPreferences()
};

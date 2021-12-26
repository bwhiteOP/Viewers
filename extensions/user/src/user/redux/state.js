/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 09, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { Status } from './constants';

/**
 * @typedef {{
 *      status: string,
 *      lastUpdated?: string,
 *      expiredOn?: string,
 *      error?: string,
 *      payload: types.User
 * }} UserState
 */

/** @type {UserState} */
export const defaultState = {
    status: Status.INITIAL,
    lastUpdated: undefined,
    expiredOn: undefined,
    error: undefined,
    payload: {
        identity: undefined,
        permissions: {
            allowPathologyClassification: false,
            allowViewReports: false,
            allowFullDICOM: false,
            allowDownload: false,
            allowUpload: false,
            allowUserPreferences: false,
        }
    }
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reducers as userPreferencesReducers } from './userPreferences/redux/reducers';
import { reducers as userReducers } from './user/redux/reducers';

/** @type {types.Extension} */
export const userExtension = {
    id: 'onepacs-user-extension',

    preRegistration() {
        // @ts-ignore
        const {store} = window;
        store.injectReducer('onepacs/user', userReducers);
        store.injectReducer('onepacs/userPreferences', userPreferencesReducers);
    },
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

import {
    setUser,
    loadUserFailed,
    validateUser,
} from './actions';
import {
    getUser,
    isUserExpired
} from './selectors';
import { defaultState } from './state';

const actions = {
    setUser,
    loadUserFailed,
    validateUser,
};

const selectors = {
    getUser,
    isUserExpired,
};

export const reduxUser = {
    actions,
    selectors,
    defaultState
};

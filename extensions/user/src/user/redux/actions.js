/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { ActionTypes } from './constants';
import { getUser } from './selectors';
import { validateUser as validateAsync } from '../validateUser';

/** @param {types.User} user */
export const setUser = (user) => ({
    type: ActionTypes.SET_USER,
    user,
});

/** @param {Error} error */
export const loadUserFailed = error => ({
    type: ActionTypes.LOAD_USER_FAILED,
    error,
});

export const expireUser = () => ({
    type: ActionTypes.EXPIRE_USER,
});

export const validateUser = () => {
    return async function (dispatch, getState) {
        dispatch(validatingUser());

        try {
            const user = getUser(getState());
            const success = await validateAsync(user.identity)
            dispatch(success
                ? validateUserSuccess()
                : validateUserFailed(new Error('Failed to validate user'))
            );
        } catch (error) {
            dispatch(validateUserFailed(error));
        }
    }
}

export const validatingUser = () => ({
    type: ActionTypes.VALIDATING_USER
});

export const validateUserSuccess = () => ({
    type: ActionTypes.VALIDATE_USER_SUCCESS,
});

/** @param {Error} error */
export const validateUserFailed = error => ({
    type: ActionTypes.VALIDATE_USER_FAILED,
    error,
});

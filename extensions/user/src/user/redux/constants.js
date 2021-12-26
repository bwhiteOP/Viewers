/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

export const ActionTypes = {
    LOADING_USER: 'USER::LOADING',
    SET_USER: 'USER::SET',
    LOAD_USER_FAILED: 'USER::LOAD_FAILED',
    VALIDATING_USER: 'USER::VALIDATING',
    VALIDATE_USER_SUCCESS: 'USER::VALIDATE_SUCCESS',
    VALIDATE_USER_FAILED: 'USER::VALIDATE_FAILED',
    EXPIRE_USER: 'USER::EXPIRED',
};

export const Status = {
    INITIAL: 'initial',
    LOADING: 'loading',
    VALIDATING: 'validating',
    SUCCESS: 'success',
    FAILED: 'failed',
    EXPIRED: 'expired',
};

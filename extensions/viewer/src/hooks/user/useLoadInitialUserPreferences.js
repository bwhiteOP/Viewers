/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxUserPreferences, reduxUser } from '@onepacs/user';

const { loadUserPreferencesIfNeeded } = reduxUserPreferences.actions;
const { getUser } = reduxUser.selectors;

/**
 * A custom hook that loads the user preferences when user identity changes.
 */
export function useLoadInitialUserPreferences() {
    const dispatch = useDispatch();
    const user = useSelector(getUser);

    useEffect(() => {
        if (user && user.identity) {
            dispatch(loadUserPreferencesIfNeeded());
        }
    }, [dispatch, user]);
}

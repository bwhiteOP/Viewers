/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 09, 2020 by Jay Liu
 */

import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUser } from '@onepacs/user';

const { actions, selectors, defaultState } = reduxUser;

/**
 * A custom hook that get and set the current user.
 * @returns {[
 *      types.User,
 *      function(types.User): void
 * ]}
 */
export function useUser() {
    const dispatch = useDispatch();
    const userFromRedux = useSelector(selectors.getUser);

    /** @type{types.useState<types.User>} */
    const [userCache, setUserCache] = useState(userFromRedux || defaultState.payload);

    /**
     * Redux state returns a new copy everytime.
     * We need to actually perform deep equality check
     * to make sure the object is actually changed.
     */
    useEffect(() => {
        if (!_.isEqual(userFromRedux, userCache)) {
            setUserCache(userFromRedux);
        }
    }, [userFromRedux, userCache]);


    /** @param {types.User} user */
    function setUser(user) {
        dispatch(actions.setUser(user));
    }

    return [
        userCache,
        setUser
    ];
}

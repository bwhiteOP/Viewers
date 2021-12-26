/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 06, 2020 by Jay Liu
 */

import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUserPreferences } from '@onepacs/user';

const { actions, selectors, defaultState } = reduxUserPreferences;

/**
 * A custom hook that gets and sets the user preference of a specific key.
 * @template {keyof types.UserPreferences} T
 * @param {T} key
 * @returns {[
 *      types.UserPreferences[key],
 *      types.UserPreferences[key],
 *      function(types.UserPreferences[key]): Promise<void>,
 * ]}
 */
export function useUserPreferences(key) {
    const dispatch = useDispatch();
    const preferencesFromRedux = useSelector(state => { return selectors.getPreferences(state, key); });
    const defaultPreferences = defaultState.payload[key];

    /** @type {types.useState<types.UserPreferences[T]>} */
    const [preferencesCache, setPreferencesCache] = useState(preferencesFromRedux || defaultPreferences);

    /**
     * Redux state returns a new copy everytime.
     * We need to actually perform deep equality check
     * to make sure the object is actually changed.
     */
    useEffect(() => {
        if (!_.isEqual(preferencesFromRedux, preferencesCache)) {
            setPreferencesCache(preferencesFromRedux);
        }
    }, [preferencesFromRedux, preferencesCache])

    async function savePreferences(preferences) {
        const userPreferences = { [key]: preferences };
        await dispatch(actions.saveUserPreferences(userPreferences))
    }

    return [
        preferencesCache,
        defaultPreferences,
        savePreferences,
    ];
}

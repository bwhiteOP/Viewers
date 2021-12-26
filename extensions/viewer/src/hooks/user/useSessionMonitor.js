/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { reduxUser } from '@onepacs/user';
import { useInterval } from '../general/useInterval';

const MINUTE = 60 * 1000;

/**
 * A custom hook that tries to renew user session on a regular interval.
 * @returns {boolean} is expired.
 */
export function useSessionMonitor() {
    const [interval] = useState(1 * MINUTE);
    const isExpired = useSelector(reduxUser.selectors.isUserExpired);
    const dispatch = useDispatch();

    useInterval(async () => {
        dispatch(reduxUser.actions.validateUser());
    }, interval);

    return isExpired;
}

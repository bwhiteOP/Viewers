/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import { useContext } from 'react';
import { getApp } from '../ohif';

const { AppContext: OhifAppContext } = getApp();

/**
 * A custom hook that consolidate things from OHIF.
 */
export function useOhifContext() {
    const { appConfig, activeContexts } = useContext(OhifAppContext);

    return {
        appConfig,
        activeContexts
    };
}

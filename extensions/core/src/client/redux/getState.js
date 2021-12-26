/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import { getStore } from './getStore';

/**
 * Get a snapshot of the current redux store.
 * @returns {any}
 */
export function getState() {
    // @ts-ignore
    return getStore().getState()
}

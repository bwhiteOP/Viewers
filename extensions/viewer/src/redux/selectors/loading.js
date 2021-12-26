/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 04, 2021 by PoyangLiu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * @typedef {{ percentComplete: number, error?: Error }} ProgressData
 * @typedef {types.Dictionary<ProgressData>} ProgressMap
 * @typedef {{
 *   progress: ProgressMap,
 *   lastUpdated?: Date }
 * } LoadingState
 */

export function getLoading(state) {
    return /** @type {LoadingState} */ (state.loading || { progress: {} });
}


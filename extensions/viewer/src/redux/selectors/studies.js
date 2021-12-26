/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * May 28, 2021 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * @typedef {{
 *  studyData: types.Dictionary<types.OHIFStudy>
 * }} StudiesState
 */

export function getStudies(state) {
    return /** @type {StudiesState} */ (state.studies);
}

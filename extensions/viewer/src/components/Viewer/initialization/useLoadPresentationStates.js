/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 20, 2021 by Jay Liu
 */

import { useEffect } from 'react';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { loadPresentationStates } from '@onepacs/presentation-state';

/**
 * Set initial layout based on the modality in the study.
 * TODO: initial layout should be implemented using Hanging Protocols default strategy
 * @param {types.OHIFStudy[]} studies
 */
export function useLoadPresentationStates(studies) {
    useEffect(() => {
        loadPresentationStates(studies);
    }, [studies]);
}

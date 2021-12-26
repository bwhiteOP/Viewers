/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 11, 2021 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import { getElement } from './getElement';

/**
 * Get the current enabled element data.
 * @param {HTMLElement=} element
 * @returns {*}
 */
export function getViewport(element) {
    element = element || getElement();
    if (!element)
        return;

    return cornerstone.getViewport(element);
}

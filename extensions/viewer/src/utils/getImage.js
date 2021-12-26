/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * July 19, 2021 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import { getElement } from './getElement';

/**
 * Get the image of the current enabled element.
 * @param {HTMLElement=} element
 * @returns {*}
 */
export function getImage(element) {
    element = element || getElement();
    if (!element)
        return;

    const enabledElement = cornerstone.getEnabledElement(element);
    return enabledElement.image;
}

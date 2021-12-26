/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import { getElement } from './getElement';

/**
 * @typedef {{
 *      currentImageIdIndex: number;
 *      imageIds: string[];
 * }} StackData */

/**
 * Get the current stack data.
 * @param {HTMLElement} element
 * @returns {StackData | undefined} stack data
 */
export function getStackData(element) {
    element = element ?? getElement();
    if (!element) return;

    const stackData = cornerstoneTools.getToolState(element, 'stack');
    if (!stackData || !stackData.data || !stackData.data.length) return;
    return stackData.data[0];
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 15, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import cornerstoneTools from 'cornerstone-tools';

/**
 * Get the tool that is active for the specified mouse button.
 * Note that this must be called after cornerstone.EVENTS.ELEMENT_ENABLED event
 * had been fired. Otherwise the tool for the enabled element will be empty.
 * @param {types.MouseButtonMask} mouseButtonMask
 * @returns {Object | undefined} the active tool for the current enabled element
 */
export function getActiveTool(mouseButtonMask) {
    // @ts-ignore
    return cornerstoneTools.store.state.tools
        .filter(t => {
            return t.mode === 'active'
                && t.supportedInteractionTypes.includes('Mouse')
                && t.options.isMouseActive
                && t.options.mouseButtonMask
                && t.options.mouseButtonMask.includes(mouseButtonMask)
        })[0]; // take the first one
}

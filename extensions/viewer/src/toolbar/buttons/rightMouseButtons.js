/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, MouseButtonMask } from '@onepacs/core';
import * as buttons from './mainButtons';
import { cloneButton } from './cloneButton';

const rightMouseButton = { commandOptions: { mouseButtonMask: MouseButtonMask.Secondary }};

/**
 * The right mouse group button.
 * @type {types.ToolbarButton}
 */
export default {
    id: 'OP-toggleRightMouseTools',
    label: 'Right',
    icon: 'mouse-right',
    tooltip: {
        title: 'Right Mouse Button Tool',
        descriptioin: 'Select a tool assigned to right mouse button'
    },
    buttons: [
        // override the ids, they must be unique
        cloneButton(buttons.stackScroll, rightMouseButton),
        cloneButton(buttons.zoom, rightMouseButton),
        cloneButton(buttons.magnify, rightMouseButton),
        cloneButton(buttons.wwwc, rightMouseButton),
        cloneButton(buttons.pan, rightMouseButton),
    ]
};

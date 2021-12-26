/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, MouseButtonMask } from '@onepacs/core';
import * as buttons from './mainButtons';
import { cloneButton } from './cloneButton';

const leftMouseButton = { commandOptions: { mouseButtonMask: MouseButtonMask.Primary }};

/**
 * The left mouse group button.
 * @type {types.ToolbarButton}
 */
export default {
    id: 'OP-toggleLeftMouseTools',
    label: 'Left',
    icon: 'mouse-left',
    tooltip: {
        title: 'Left Mouse Button Tool',
        description: 'Select a tool assigned to left mouse button'
    },
    buttons: [
        // override the ids, they must be unique
        cloneButton(buttons.stackScroll, leftMouseButton),
        cloneButton(buttons.zoom, leftMouseButton),
        cloneButton(buttons.magnify, leftMouseButton),
        cloneButton(buttons.wwwc, leftMouseButton),
        cloneButton(buttons.pan, leftMouseButton),
        cloneButton(buttons.length, leftMouseButton),
        cloneButton(buttons.annotate, leftMouseButton),
        cloneButton(buttons.angle, leftMouseButton),
        cloneButton(buttons.wwwcRegion, leftMouseButton),
        cloneButton(buttons.probe, leftMouseButton),
        cloneButton(buttons.crosshairs, leftMouseButton),
        cloneButton(buttons.ellipticalRoi, leftMouseButton),
        cloneButton(buttons.rectangleRoi, leftMouseButton),
        cloneButton(buttons.polygonalRoi, leftMouseButton),
        cloneButton(buttons.freehandRoi, leftMouseButton),
    ]
};

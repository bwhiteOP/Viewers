/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 25, 2020 by Jay Liu
 */

/* eslint-disable no-unused-vars */
import { types } from '@onepacs/core';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '../toolsMapping';

// @ts-ignore
const BaseTool = cornerstoneTools.import('base/BaseTool');

/**
 * @class MagnifyMultiTouchTool - Define a MagnifyTool that can be activated using multi-touch.
 * @augments {types.BaseTool}
 */
export class MagnifyMultiTouchTool extends BaseTool {

    constructor(props = {}) {
        const defaultProps = {
            name: toolsMapping.magnifyMultiTouch,
            supportedInteractionTypes: ['MultiTouch'],
            configuration: {
                touchPointers: 2,
            },
        };

        super(props, defaultProps);

        // MultiTouch
        this.multiTouchDragCallback = multiTouchDragCallback.bind(this);
    }
}

/** @param {*} evt */
function multiTouchDragCallback(evt) {
    if (evt.detail.numPointers < this.configuration.touchPointers)
        return;

    this._updateMagnifyingGlass(evt);
}

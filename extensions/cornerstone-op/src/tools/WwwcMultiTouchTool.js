/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 25, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '../toolsMapping';

// @ts-ignore
const BaseTool = cornerstoneTools.import('base/BaseTool');

/**
 * @class WwwcMultiTouchTool - Define a WwwcTool that can be activated using multi-touch.
 * @augments {types.BaseTool}
 */
export class WwwcMultiTouchTool extends BaseTool {
    constructor(props = {}) {
        const defaultProps = {
            name: toolsMapping.wwwcMultiTouch,
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

    // Prevent CornerstoneToolsTouchStartActive from killing any press events
    evt.stopImmediatePropagation();
    const wwwcTool = new cornerstoneTools.WwwcTool();
    wwwcTool.applyActiveStrategy(evt);
    cornerstone.setViewport(evt.detail.element, evt.detail.viewport);
}

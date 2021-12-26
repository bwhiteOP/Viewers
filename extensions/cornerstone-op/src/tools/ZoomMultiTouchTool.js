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
 * @class ZoomMultiTouchTool - Define a ZoomTool that can be activated using multi-touch.
 * @augments {types.BaseTool}
 */
export class ZoomMultiTouchTool extends BaseTool {

    constructor(props = {}) {
        const defaultProps = {
            name: toolsMapping.zoomMultiTouch,
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

    const deltaY = evt.detail.deltaPoints.page.y;
    if (!deltaY)
        return false;

    const zoomTool = new cornerstoneTools.ZoomTool();
    zoomTool.applyActiveStrategy(evt, this.configuration);
    cornerstone.setViewport(evt.detail.element, evt.detail.viewport);
}

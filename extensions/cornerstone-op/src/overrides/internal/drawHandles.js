/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

const { toolStyle, toolColors } = cornerstoneTools;

const path = cornerstoneTools.import('drawing/path');

const handleSize = 6;

/**
 * This module deals with drawing handles for image tools
 * Draws proivded handles to the provided context
 * Override to draw X instead of O for tool handles
 * @public
 * @method drawHandles
 * @memberof Drawing
 * @see https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/drawing/drawHandles.js
 *
 * @param {CanvasRenderingContext2D} context - Target context
 * @param {*} evtDetail - Cornerstone's 'cornerstoneimagerendered' event's `detail`
 * @param {Object[]|Object} handles - An array of handle objects, or an object w/ named handle objects
 * @param {Object} [options={}] - Options object
 * @param {string} [options.color]
 * @param {Boolean} [options.drawHandlesIfActive=false] - Whether the handles should only be drawn if Active (hovered/selected)
 * @param {Boolean} [options.drawAllHandles=false] - Override drawHandlesIfActive and draw all handles regardless of active state
 * @param {string} [options.fill]
 * @param {Number} [options.handleRadius=6]
 */
export function drawHandles(context, evtDetail, handles, options = {}) {
    const {element} = evtDetail;
    const defaultColor = toolColors.getToolColor();

    context.strokeStyle = options.color || defaultColor;

    const handleKeys = Object.keys(handles);

    for (let i = 0; i < handleKeys.length; i++) {
        const handleKey = handleKeys[i];
        const handle = handles[handleKey];

        if (handle.drawnIndependently === true) {
            continue;
        }

        if (!options.drawAllHandles) {
            if (options.drawHandlesIfActive === true && !handle.active) {
                continue;
            }
        }

        const lineWidth = handle.active
            ? toolStyle.getActiveWidth()
            : toolStyle.getToolWidth();
        const fillStyle = options.fill;

        path(
            context,
            {
                lineWidth,
                fillStyle,
            },
            context => {
                const handleCanvasCoords = cornerstone.pixelToCanvas(
                    element,
                    handle
                );

                const topLeft = {
                    x: handleCanvasCoords.x - handleSize,
                    y: handleCanvasCoords.y - handleSize
                };
                const topRight = {
                    x: handleCanvasCoords.x + handleSize,
                    y: handleCanvasCoords.y - handleSize
                };
                const bottomLeft = {
                    x: handleCanvasCoords.x - handleSize,
                    y: handleCanvasCoords.y + handleSize
                };
                const bottomRight = {
                    x: handleCanvasCoords.x + handleSize,
                    y: handleCanvasCoords.y + handleSize
                };

                //  Draw X for handles
                context.moveTo(topLeft.x, topLeft.y);
                context.lineTo(bottomRight.x, bottomRight.y);
                context.moveTo(topRight.x, topRight.y);
                context.lineTo(bottomLeft.x, bottomLeft.y);
            }
        );
    }
}

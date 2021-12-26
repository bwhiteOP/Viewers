/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

const maxValue = 1000000;
const minValue = -1000000;

/**
 * Converts an array of points into the start/end handles of an ellipse.
 * The handles are the top-left and bottom-right corner of an ellipse.
 * @param {types.Point[]} points the array of points describing the ellipse
 * @param {number} [radius] Optional radius
 * @returns {types.StartEnd<types.Point>}
 */
export function convertEllipticalPointsToHandles(points, radius) {
    if (radius && points.length > 0) {
        return {
            start: {
                x: points[0].x - radius,
                y: points[0].y - radius
            },
            end: {
                x: points[0].x + radius,
                y: points[0].y + radius
            }
        };
    }

    let startX = maxValue;
    let startY = maxValue;
    let endX = minValue;
    let endY = minValue;

    points.forEach((point) => {
        startX = Math.min(startX, point.x);
        startY = Math.min(startY, point.y);
        endX = Math.max(endX, point.x);
        endY = Math.max(endY, point.y);
    });

    return {
        start: {
            x: startX,
            y: startY
        },
        end: {
            x: endX,
            y: endY
        }
    };
}

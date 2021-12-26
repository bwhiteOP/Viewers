/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import _ from 'lodash';

const maxValue = 1000000;
const minValue = -1000000;

/**
 * Check if an array of points is a closed rectangle.
 * Note that the last point must match the first.
 * @param {types.Point[]} points
 * @returns {boolean}
 */
export function isRectangle(points) {
    if (points.length !== 5) {
        return false;
    }

    if (!_.isEqual(points[0], points[4])) {
        return false;
    }

    let minX = maxValue;
    let minY = maxValue;
    let maxX = minValue;
    let maxY = minValue;

    //  Calculate min and max points
    for (let i = 0; i < points.length; i++) {
        if (points[i].x < minX) {
            minX = points[i].x;
        }
        if (points[i].x > maxX) {
            maxX = points[i].x;
        }

        if (points[i].y < minY) {
            minY = points[i].y;
        }
        if (points[i].y > maxY) {
            maxY = points[i].y;
        }
    }

    // Check if every corner contains at least one point
    for (let i = 0; i < points.length; i++) {
        if (points[i].x === minX && points[i].y === minY) {
            continue;
        }
        if (points[i].x === maxX && points[i].y === minY) {
            continue;
        }
        if (points[i].x === minX && points[i].y === maxY) {
            continue;
        }
        if (points[i].x === maxX && points[i].y === maxY) {
            continue;
        }

        return false;
    }

    //  Check if belonging to the sides of rectangle
    for (let i = 0; i < points.length; i++) {
        if (points[i].x >= minX && points[i].x <= maxX && (points[i].y === minY || points[i].y === maxY)) {
            continue;
        }
        if (points[i].y >= minY && points[i].y <= maxY && (points[i].x === minX || points[i].x === maxX)) {
            continue;
        }

        return false;
    }

    return true;
}

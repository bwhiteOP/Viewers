/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import { drawLength } from './drawLength';
import { drawAngle } from './drawAngle';
import { drawRectangle } from './drawRectangle';
import { drawPolygon } from './drawPolygon';
import { isRectangle } from './isRectangle';

export function drawPolyline(element, text, points) {
    let roiId;

    if (points.length === 2) {
        roiId = drawLength(element, text, points);
    } else if (points.length === 3) {
        roiId = drawAngle(element, text, points);
    } else if (isRectangle(points)) {
        roiId = drawRectangle(element, text, points);
    } else {
        roiId = drawPolygon(element, text, points);
    }

    return roiId;
}

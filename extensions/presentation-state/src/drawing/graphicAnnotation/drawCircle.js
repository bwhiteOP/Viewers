/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import { drawEllipse } from './drawEllipse';

export function drawCircle(element, text, points) {
    if (points.length < 2) {
        console.error('drawGraphicAnnotation: Circle must have at least 2 points');
        return;
    }

    const deltaX = points[1].x - points[0].x;
    const deltaY = points[1].y - points[0].y;
    const radius = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

    return drawEllipse(element, text, [points[0]], radius);
}

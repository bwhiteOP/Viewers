/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import UUID from 'uuid-js';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '@onepacs/cornerstone';

export function drawLength(element, text, points) {
    if (points.length < 2) {
        console.error('drawGraphicAnnotation: Length must have at least 2 points');
        return;
    }

    const roiId = UUID.create().toString();

    const measurementData = {
        id: roiId,
        visible: true,
        active: false,
        color: undefined,
        invalidated: true,
        handles: {
            start: {
                x: points[0].x,
                y: points[0].y,
                highlight: true,
                active: false
            },
            end: {
                x: points[1].x,
                y: points[1].y,
                highlight: true,
                active: false
            },
            textBox: {
                active: false,
                hasMoved: false,
                movesIndependently: false,
                drawnIndependently: true,
                allowedOutsideImage: true,
                hasBoundingBox: true
            }
        }
    };

    cornerstoneTools.addToolState(element, toolsMapping.length, measurementData);

    return roiId;
}

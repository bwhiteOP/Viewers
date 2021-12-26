/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import UUID from 'uuid-js';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '@onepacs/cornerstone';

export function drawAngle(element, text, points) {
    // A distinction between angle and triangle is that the triangle (a polygon) has exactly 4 points,
    // with the first point identical to the last point. An angle has exactly 3 point.
    if (points.length !== 3) {
        console.error('drawGraphicAnnotation: Angle must have exactly 3 points');
        return;
    }

    const roiId = UUID.create().toString();

    //  Show analysis by default if text is defined
    const showAnalysis = !!text;

    const measurementData = {
        id: roiId,
        visible: true,
        active: false,
        invalidated: true,
        color: undefined,
        text,
        showAnalysis,
        handles: {
            start: {
                x: points[0].x,
                y: points[0].y,
                highlight: true,
                active: false
            },
            middle: {
                x: points[1].x,
                y: points[1].y,
                highlight: true,
                active: false
            },
            end: {
                x: points[2].x,
                y: points[2].y,
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

    cornerstoneTools.addToolState(element, toolsMapping.angle, measurementData);

    return roiId;
}

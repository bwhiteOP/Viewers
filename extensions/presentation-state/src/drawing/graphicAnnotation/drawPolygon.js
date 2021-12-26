/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import UUID from 'uuid-js';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '@onepacs/cornerstone';

export function drawPolygon(element, text, points) {
    if (points.length < 4) {
        console.error('drawGraphicAnnotation: Polygon must have at least 4 points');
        return;
    }

    const roiId = UUID.create().toString();
    const handles_points = [];

    //  Remove the last point if it equals to the first one
    if (_.isEqual(points[0], points[points.length - 1])) {
        points.splice(-1, 1);
    }

    for (let i = 0; i < points.length; i++) {
        let j = i + 1;
        if (j >= points.length) {
            j = 0;
        }

        handles_points.push({
            x: points[i].x,
            y: points[i].y,
            lines: [{
                x: points[j].x,
                y: points[j].y
            }]
        });
    }

    //  Show analysis by default if text is defined
    const showAnalysis = !!text;

    const measurementData = {
        id: roiId,
        visible: true,
        active: false,
        invalidated: true,
        color: undefined,
        showAnalysis,
        handles: {
            points: handles_points,
            textBox: {
                active: false,
                hasMoved: false,
                movesIndependently: false,
                drawnIndependently: true,
                allowedOutsideImage: true,
                hasBoundingBox: true,
                hidden: false
            }
        }
    };

    // polygonal tool, at its essense, is the same as freehandRoi
    // The only difference is the mouse behaviour
    cornerstoneTools.addToolState(element, toolsMapping.freehandRoi, measurementData);

    return roiId;
}


/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import UUID from 'uuid-js';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '@onepacs/cornerstone';
import { isSpineLabel } from './isSpineLabel';
import { convertEllipticalPointsToHandles } from './convertEllipticalPointsToHandles';

export function drawEllipse(element, text, points, radius) {
    const roiId = UUID.create().toString();
    const handles = convertEllipticalPointsToHandles(points, radius);

    //  Show analysis by default if text is defined
    let showAnalysis = !!text;
    let textToShow;

    //  HV-271 Show text and hide analysis if it is a spine label
    if (isSpineLabel(text)) {
        showAnalysis = false;
        textToShow = text;
    }

    const measurementData = {
        id: roiId,
        visible: true,
        active: false,
        invalidated: true,
        color: undefined,
        text: textToShow,
        showAnalysis,
        handles: {
            start: {
                x: handles.start.x,
                y: handles.start.y,
                highlight: true,
                active: false
            },
            end: {
                x: handles.end.x,
                y: handles.end.y,
                highlight: true,
                active: false
            },
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

    cornerstoneTools.addToolState(element, toolsMapping.ellipticalRoi, measurementData);

    return roiId;
}

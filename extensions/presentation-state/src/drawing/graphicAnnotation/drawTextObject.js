/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 28, 2021 by Jay Liu
 */

import UUID from 'uuid-js';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '@onepacs/cornerstone';

export function drawTextObject(element, textObject) {
    //  Skip if the text object is already drawn
    if (textObject.roiId) {
        return;
    }

    const roiId = UUID.create().toString();

    let roiTypeName;
    let measurementData;

    if (textObject.anchorPointVisibility && textObject.anchorPointVisibility.toUpperCase() !== 'N' &&
        textObject.anchorPoint && textObject.anchorPoint.x !== undefined && textObject.anchorPoint.y !== undefined) {
        roiTypeName = toolsMapping.annotate;
        measurementData = {
            id: roiId,
            visible: true,
            active: false,
            text: textObject.unformattedTextValue,
            color: undefined,
            handles: {
                start: {
                    x: textObject.anchorPoint.x,
                    y: textObject.anchorPoint.y,
                    highlight: true,
                    active: false
                },
                end: {
                    x: (textObject.boundingBoxBottomRightHandCorner.x + textObject.boundingBoxTopLeftHandCorner.x) / 2,
                    y: (textObject.boundingBoxBottomRightHandCorner.y + textObject.boundingBoxTopLeftHandCorner.y) / 2,
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
    } else {
        roiTypeName = toolsMapping.textMarker;
        measurementData = {
            visible: true,
            active: false,
            text: textObject.unformattedTextValue,
            color: undefined,
            handles: {
                end: {
                    x: (textObject.boundingBoxBottomRightHandCorner.x + textObject.boundingBoxTopLeftHandCorner.x) / 2,
                    y: (textObject.boundingBoxBottomRightHandCorner.y + textObject.boundingBoxTopLeftHandCorner.y) / 2,
                    highlight: true,
                    active: false,
                    hasBoundingBox: true
                }
            }
        };
    }

    cornerstoneTools.addToolState(element, roiTypeName, measurementData);

    textObject.roiId = roiId;
}

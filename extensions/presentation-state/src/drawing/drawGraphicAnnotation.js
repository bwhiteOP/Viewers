/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import {
    drawEllipse,
    drawPolyline,
    drawCircle,
    drawTextObject
} from './graphicAnnotation';

export function drawGraphicAnnotation(element, graphicAnnotation) {
    if (graphicAnnotation.graphicObjects && graphicAnnotation.graphicObjects.length > 0) {
        graphicAnnotation.graphicObjects.forEach((graphicObject) => {
            drawGraphicObject(element, graphicObject);
        });
    } else if (graphicAnnotation.textObjects && graphicAnnotation.textObjects.length > 0) {
        graphicAnnotation.textObjects.forEach((textObject) => {
            drawTextObject(element, textObject);
        });
    }
}

function drawGraphicObject(element, graphicObject) {
    if (!graphicObject.graphicType || !graphicObject.graphicData) {
        return;
    }

    //  Skip if the graphic object is already drawn
    if (graphicObject.roiId) {
        return;
    }

    const text = graphicObject.textObject && graphicObject.textObject.unformattedTextValue;

    switch (graphicObject.graphicType.toUpperCase()) {
        case 'POINT':
            graphicObject.roiId = drawEllipse(element, text, graphicObject.graphicData, 5);
            break;
        case 'POLYLINE':
            graphicObject.roiId = drawPolyline(element, text, graphicObject.graphicData);
            break;
        case 'CIRCLE':
            graphicObject.roiId = drawCircle(element, text, graphicObject.graphicData);
            break;
        case 'ELLIPSE':
            graphicObject.roiId = drawEllipse(element, text, graphicObject.graphicData);
            break;
        case 'INTERPOLATED':
            // TODO: Support for drawing interpolated graphics
            console.warn('DICOM Presentation State: Interpolated graphics are not supported.');
            break;
        default:
            break;
    }
}

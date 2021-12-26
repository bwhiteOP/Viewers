/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 15, 2021 by Jay Liu
 */

import { graphicLayer, pointPrecision } from './constants';
import { serializeRoiText } from './serializeRoiText';
import { serializeReferencedImageSequence } from '../serializeReferencedImageSequence';

export function serializeRectangleRoi(roiData, instance) {
    if (!roiData || !roiData.handles || !roiData.handles.start || !roiData.handles.end) {
        return;
    }

    const graphicWidth = Math.abs(roiData.handles.start.x - roiData.handles.end.x);
    const graphicHeight = Math.abs(roiData.handles.start.y - roiData.handles.end.y);

    const topLeftX = Math.min(roiData.handles.start.x, roiData.handles.end.x);
    const topLeftY = Math.min(roiData.handles.start.y, roiData.handles.end.y);

    const graphicData = [
        (topLeftX).toFixed(pointPrecision), // x of top-left point of horizontal axis
        (topLeftY).toFixed(pointPrecision), // y of top-left point of horizontal axis
        (topLeftX + graphicWidth).toFixed(pointPrecision), // x of top-right point of horizontal axis
        (topLeftY).toFixed(pointPrecision), // y of top-right point of horizontal axis
        (topLeftX + graphicWidth).toFixed(pointPrecision), // x of bottom-right point of vertical axis
        (topLeftY + graphicHeight).toFixed(pointPrecision), // y of bottom-right point of vertical axis
        (topLeftX).toFixed(pointPrecision), // x of bottom-left point of vertical axis
        (topLeftY + graphicHeight).toFixed(pointPrecision), // y of bottom-left point of vertical axis
        (topLeftX).toFixed(pointPrecision), // x of top-left point of vertical axis
        (topLeftY).toFixed(pointPrecision), // y of top-left point of vertical axis
    ];

    return {
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        GraphicLayer: graphicLayer,
        TextObjectSequence: serializeRoiText(roiData),
        GraphicObjectSequence: [{
            GraphicAnnotationUnits: 'PIXEL',
            GraphicDimensions: 2,
            NumberOfGraphicPoints: 5,
            GraphicType: 'POLYLINE',
            GraphicFilled: 'N',
            GraphicData: graphicData
        }]
    };
}

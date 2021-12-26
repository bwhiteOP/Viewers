/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 15, 2021 by Jay Liu
 */

import { graphicLayer, pointPrecision } from './constants';
import { serializeRoiText } from './serializeRoiText';
import { serializeReferencedImageSequence } from '../serializeReferencedImageSequence';

export function serializeAngle(roiData, instance) {
    if (!roiData || !roiData.handles || !roiData.handles.start || !roiData.handles.middle || !roiData.handles.end) {
        return;
    }

    const graphicData = [];

    //  Add all vertices of angle roi
    graphicData.push((roiData.handles.start.x).toFixed(pointPrecision));
    graphicData.push((roiData.handles.start.y).toFixed(pointPrecision));
    graphicData.push((roiData.handles.middle.x).toFixed(pointPrecision));
    graphicData.push((roiData.handles.middle.y).toFixed(pointPrecision));
    graphicData.push((roiData.handles.end.x).toFixed(pointPrecision));
    graphicData.push((roiData.handles.end.y).toFixed(pointPrecision));

    return {
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        GraphicLayer: graphicLayer,
        TextObjectSequence: serializeRoiText(roiData),
        GraphicObjectSequence: [{
            GraphicAnnotationUnits: 'PIXEL',
            GraphicDimensions: 2,
            NumberOfGraphicPoints: 3,
            GraphicType: 'POLYLINE',
            GraphicFilled: 'N',
            GraphicData: graphicData
        }]
    };
}

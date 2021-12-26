/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 15, 2021 by Jay Liu
 */

import { graphicLayer, pointPrecision } from './constants';
import { serializeRoiText } from './serializeRoiText';
import { serializeReferencedImageSequence } from '../serializeReferencedImageSequence';

export function serializePolygonalRoi(roiData, instance) {
    if (!roiData || !roiData.handles || !roiData.handles.points || roiData.handles.points.length < 3) {
        return;
    }

    const graphicData = [];

    //  Add all vertices of polygonal roi
    roiData.handles.points.forEach(point => {
        graphicData.push((point.x).toFixed(pointPrecision));
        graphicData.push((point.y).toFixed(pointPrecision));
    });

    //  Add the start vertex of polygonal roi
    graphicData.push((roiData.handles.points[0].x).toFixed(pointPrecision));
    graphicData.push((roiData.handles.points[0].y).toFixed(pointPrecision));

    return {
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        GraphicLayer: graphicLayer,
        TextObjectSequence: serializeRoiText(roiData),
        GraphicObjectSequence: [{
            GraphicAnnotationUnits: 'PIXEL',
            GraphicDimensions: 2,
            NumberOfGraphicPoints: graphicData.length / 2,
            GraphicType: 'POLYLINE',
            GraphicFilled: 'N',
            GraphicData: graphicData
        }]
    };
}


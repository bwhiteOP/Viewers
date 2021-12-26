/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 15, 2021 by Jay Liu
 */

import { graphicLayer, pointPrecision } from './constants';
import { serializeRoiText } from './serializeRoiText';
import { serializeReferencedImageSequence } from '../serializeReferencedImageSequence';

export function serializeLength(roiData, instance) {
    if (!roiData || !roiData.handles || !roiData.handles.start || !roiData.handles.end) {
        return;
    }

    const graphicData = [
        (roiData.handles.start.x).toFixed(pointPrecision),
        (roiData.handles.start.y).toFixed(pointPrecision),
        (roiData.handles.end.x).toFixed(pointPrecision),
        (roiData.handles.end.y).toFixed(pointPrecision)
    ];

    return {
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        GraphicLayer: graphicLayer,
        TextObjectSequence: serializeRoiText(roiData),
        GraphicObjectSequence: [{
            GraphicAnnotationUnits: 'PIXEL',
            GraphicDimensions: 2,
            NumberOfGraphicPoints: 2,
            GraphicType: 'POLYLINE',
            GraphicFilled: 'N',
            GraphicData: graphicData
        }]
    };
}

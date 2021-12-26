/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 15, 2021 by Jay Liu
 */

import { graphicLayer, pointPrecision } from './constants';
import { serializeReferencedImageSequence } from '../serializeReferencedImageSequence';

export function serializeTextMarker(roiData, instance) {
    if (!roiData || !roiData.handles) {
        return;
    }

    const textBox = roiData.handles.end;
    if (!textBox || !textBox.boundingBox || !textBox.hasBoundingBox) {
        return;
    }

    const boundingBoxTopLeftHandCorner = [
        (textBox.x).toFixed(pointPrecision),
        (textBox.y).toFixed(pointPrecision)
    ];

    const boundingBoxBottomRightHandCorner = [
        (textBox.x + textBox.boundingBox.width).toFixed(pointPrecision),
        (textBox.y + textBox.boundingBox.height).toFixed(pointPrecision)
    ];

    return {
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        GraphicLayer: graphicLayer,
        TextObjectSequence: [{
            BoundingBoxAnnotationUnits: 'PIXEL',
            AnchorPointAnnotationUnits: 'PIXEL',
            UnformattedTextValue: roiData.text || '',
            BoundingBoxTextHorizontalJustification: 'LEFT',
            BoundingBoxTopLeftHandCorner: boundingBoxTopLeftHandCorner,
            BoundingBoxBottomRightHandCorner: boundingBoxBottomRightHandCorner,
        }]
    };
}

/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 15, 2021 by Jay Liu
 */

import { pointPrecision } from './constants';

export function serializeRoiText(roiData) {
    if (!roiData) {
        return;
    }

    let { textBox } = roiData;
    if (!textBox && roiData.handles) {
        ({ textBox } = roiData.handles);
    }

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

    const anchorPoint = [
        (textBox.x + (textBox.boundingBox.width / 2)).toFixed(pointPrecision),
        (textBox.y + (textBox.boundingBox.height / 2)).toFixed(pointPrecision)
    ];

    return [{
        BoundingBoxAnnotationUnits: 'PIXEL',
        AnchorPointAnnotationUnits: 'PIXEL',
        UnformattedTextValue: roiData.text || textBox.analysis || '',
        BoundingBoxTextHorizontalJustification: 'LEFT',
        BoundingBoxTopLeftHandCorner: boundingBoxTopLeftHandCorner,
        BoundingBoxBottomRightHandCorner: boundingBoxBottomRightHandCorner,
        AnchorPointVisibility: 'Y',
        AnchorPoint: anchorPoint
    }];
}

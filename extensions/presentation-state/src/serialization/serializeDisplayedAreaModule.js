/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import { serializeReferencedImageSequence } from './serializeReferencedImageSequence';

export function serializeDisplayedAreaModule(enabledElement, instance) {
    const { topLeft, bottomRight } = getDisplayArea(enabledElement);
    return [{
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        DisplayedAreaTopLeftHandCorner: [topLeft.x, topLeft.y],
        DisplayedAreaBottomRightHandCorner: [bottomRight.x, bottomRight.y],
        PresentationSizeMode: 'SCALE TO FIT',
        PresentationPixelAspectRatio: instance.PixelAspectRatio || '1\\1'
    }];
}

function getDisplayArea(enabledElement) {
    const { canvas, image } = enabledElement;

    const tlhcCanvas = {
        x: 0,
        y: 0
    };

    const brhcCanvas = {
        x: canvas.width,
        y: canvas.height
    };

    //  Get the current transform applied
    const transform = cornerstone.internal.getTransform(enabledElement);

    //  Invert the current transform
    transform.invert();

    //  Convert the canvas pixels to image pixels using the inverted transform
    const tlhcImage = transform.transformPoint(tlhcCanvas.x, tlhcCanvas.y);
    const brhcImage = transform.transformPoint(brhcCanvas.x, brhcCanvas.y);

    //  Validate that the calculated image pixels are not out of image, then round them
    tlhcImage.x = Math.round(Math.max(0, tlhcImage.x));
    tlhcImage.x = Math.round(Math.min(image.columns, tlhcImage.x));
    tlhcImage.y = Math.round(Math.max(0, tlhcImage.y));
    tlhcImage.y = Math.round(Math.min(image.rows, tlhcImage.y));
    brhcImage.x = Math.round(Math.max(0, brhcImage.x));
    brhcImage.x = Math.round(Math.min(image.columns, brhcImage.x));
    brhcImage.y = Math.round(Math.max(0, brhcImage.y));
    brhcImage.y = Math.round(Math.min(image.rows, brhcImage.y));

    return {
        topLeft: tlhcImage,
        bottomRight: brhcImage
    };
}

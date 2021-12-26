/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import deserializeReferencedImageSequence from './deserializeReferencedImageSequence';

export function deserializeDisplayedAreaModule(dataSet) {
    if (!dataSet || !dataSet.elements) {
        return;
    }

    const displayedAreaSelectionSequence = dataSet.elements.x0070005a;
    if (!displayedAreaSelectionSequence || !displayedAreaSelectionSequence.items || displayedAreaSelectionSequence.items.length < 1) {
        return;
    }

    const displayedAreas = [];

    displayedAreaSelectionSequence.items.forEach((displayedAreaSelectionSequenceItem) => {
        const displayedAreaSelectionSequenceItemDataSet = displayedAreaSelectionSequenceItem.dataSet;
        if (!displayedAreaSelectionSequenceItemDataSet || !displayedAreaSelectionSequenceItemDataSet.elements) {
            return;
        }

        const displayedAreaTopLeftHandCorner = {
            x: displayedAreaSelectionSequenceItemDataSet.int32('x00700052', 0),
            y: displayedAreaSelectionSequenceItemDataSet.int32('x00700052', 1)
        };

        const displayedAreaBottomRightHandCorner = {
            x: displayedAreaSelectionSequenceItemDataSet.int32('x00700053', 0),
            y: displayedAreaSelectionSequenceItemDataSet.int32('x00700053', 1)
        };

        const presentationSizeMode = displayedAreaSelectionSequenceItemDataSet.string('x00700100');

        const presentationPixelAspectRatio = displayedAreaSelectionSequenceItemDataSet.string('x00700102');

        const referencedImages = deserializeReferencedImageSequence(displayedAreaSelectionSequenceItemDataSet);

        displayedAreas.push({
            referencedImages,
            displayedAreaTopLeftHandCorner,
            displayedAreaBottomRightHandCorner,
            presentationSizeMode,
            presentationPixelAspectRatio
        });
    });

    return {
        displayedAreas
    };
}

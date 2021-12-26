/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

export function deserializeRelationshipModule(dataSet) {
    if (!dataSet || !dataSet.elements) {
        return;
    }

    const referencedSeriesSequence = dataSet.elements.x00081115;
    if (!referencedSeriesSequence || !referencedSeriesSequence.items || referencedSeriesSequence.items.length < 1) {
        return;
    }

    const referencedImages = [];

    referencedSeriesSequence.items.forEach((referencedSeriesSequenceItem) => {
        const referencedSeriesSequenceItemDataSet = referencedSeriesSequenceItem.dataSet;
        if (!referencedSeriesSequenceItemDataSet || !referencedSeriesSequenceItemDataSet.elements) {
            return;
        }

        const referencedSeriesInstanceUid = referencedSeriesSequenceItemDataSet.string('x0020000e');
        if (!referencedSeriesInstanceUid) {
            return;
        }

        const referencedImageSequence = referencedSeriesSequenceItemDataSet.elements.x00081140;
        if (!referencedImageSequence || !referencedImageSequence.items || referencedImageSequence.items.length < 1) {
            return;
        }

        referencedImageSequence.items.forEach((referencedImageSequenceItem) => {
            const referencedImageSequenceItemDataSet = referencedImageSequenceItem.dataSet;
            if (!referencedImageSequenceItemDataSet || !referencedImageSequenceItemDataSet.elements) {
                return;
            }

            const referencedSopInstanceUid = referencedImageSequenceItemDataSet.string('x00081155');
            if (!referencedSopInstanceUid) {
                return;
            }

            referencedImages.push({
                seriesInstanceUid: referencedSeriesInstanceUid,
                sopInstanceUid: referencedSopInstanceUid,
                sopClassUid: referencedImageSequenceItemDataSet.string('x00081150'),
                frameNumber: referencedImageSequenceItemDataSet.string('x00081160')
            });
        });
    });

    return {
        referencedImages
    };
}

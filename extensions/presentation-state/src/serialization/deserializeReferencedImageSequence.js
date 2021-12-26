/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

export default function(dataSet) {
    const referencedImages = [];

    if (!dataSet || !dataSet.elements) {
        return referencedImages;
    }

    const referencedImageSequence = dataSet.elements.x00081140;
    if (!referencedImageSequence || !referencedImageSequence.items || referencedImageSequence.items.length < 1) {
        return referencedImages;
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
            sopInstanceUid: referencedSopInstanceUid,
            sopClassUid: referencedImageSequenceItemDataSet.string('x00081150'),
            frameNumber: referencedImageSequenceItemDataSet.string('x00081160')
        });
    });

    return referencedImages;
}

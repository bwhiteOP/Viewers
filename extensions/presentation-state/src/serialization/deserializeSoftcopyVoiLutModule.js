/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import deserializeReferencedImageSequence from './deserializeReferencedImageSequence';

export function deserializeSoftcopyVoiLutModule(dataSet) {
    if (!dataSet || !dataSet.elements) {
        return;
    }

    const softcopyVOILUTSequence = dataSet.elements.x00283110;
    if (!softcopyVOILUTSequence || !softcopyVOILUTSequence.items || softcopyVOILUTSequence.items.length < 1) {
        return;
    }

    const voiLuts = [];

    softcopyVOILUTSequence.items.forEach((softcopyVOILUTSequenceItem) => {
        const softcopyVOILUTSequenceItemDataSet = softcopyVOILUTSequenceItem.dataSet;
        if (!softcopyVOILUTSequenceItemDataSet || !softcopyVOILUTSequenceItemDataSet.elements) {
            return;
        }

        const voiLutFunction = softcopyVOILUTSequenceItemDataSet.string('x00281056');
        if (voiLutFunction && voiLutFunction.toUpperCase() === 'SIGMOID') {
            console.warn('SIGMOID LUTs are not currently supported.');
            return;
        }

        const windowCenter = softcopyVOILUTSequenceItemDataSet.string('x00281050');
        const windowWidth = softcopyVOILUTSequenceItemDataSet.string('x00281051');
        if (!windowCenter || !windowWidth) {
            // TODO: Support VOI LUT Sequence
            return;
        }

        const referencedImages = deserializeReferencedImageSequence(softcopyVOILUTSequenceItemDataSet);

        voiLuts.push({
            referencedImages,
            windowCenter: parseInt(windowCenter, 10),
            windowWidth: parseInt(windowWidth, 10)
        });
    });

    return {
        voiLuts
    };
}

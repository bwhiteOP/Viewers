/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { imageUtils } from '@onepacs/core';

/**
 * Extract the VOI LUT module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.11.2.html
 */
export function voiLutModule(imageId, instance) {
    const actualImageId = imageUtils.getActualImageId(imageId).imageId || imageId;
    const voiLutModule = cornerstoneWADOImageLoader.wadouri.metaData.metaDataProvider('voiLutModule', actualImageId);
    if (!voiLutModule)
        return;

    return addLutSequenceItemDescription(voiLutModule, actualImageId);
}

function addLutSequenceItemDescription(voiLutModule, imageId) {
    if (!voiLutModule.voiLUTSequence || voiLutModule.voiLUTSequence.length === 0) {
        return voiLutModule;
    }

    const parsedImageId = cornerstoneWADOImageLoader.wadouri.parseImageId(imageId);
    const dataSet = cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.get(parsedImageId.url);
    const lutSequence = dataSet.elements.x00283010;
    for (let i = 0; i < lutSequence.items.length; i++) {
        const lutDataSet = lutSequence.items[i].dataSet;
        const lutExplanation = lutDataSet.string('x00283003');
        voiLutModule.voiLUTSequence[i].description = lutExplanation;
    }

    return voiLutModule;
}

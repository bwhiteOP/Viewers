/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 15, 2020 by Jay Liu
 */

import OHIF from '@ohif/core';
import { normalizeSliceLocation } from './utils/normalizeSliceLocation';

/**
 * Extract the image plane module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.6.2.html
 */
export function imagePlaneModule(imageId, instance) {
    if (!instance)
        return;

    const { metadataProvider: ohifMetadataProvider } = OHIF.cornerstone;
    const imagePlaneModule = ohifMetadataProvider.get('imagePlaneModule', imageId);
    imagePlaneModule.spacingBetweenSlices = instance.SpacingBetweenSlices;
    imagePlaneModule.sliceLocationNormalized = normalizeSliceLocation(imagePlaneModule)
    return imagePlaneModule;
}

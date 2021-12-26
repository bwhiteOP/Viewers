/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 11, 2021 by Jay Liu
 */

import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { imageUtils } from '@onepacs/core';

/**
 * Extract the image pixel module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.6.3.html
 */
export function imagePixelModule(imageId, instance) {
    const actualImageId = imageUtils.getActualImageId(imageId).imageId || imageId;
    return cornerstoneWADOImageLoader.wadouri.metaData.metaDataProvider('imagePixelModule', actualImageId);
}

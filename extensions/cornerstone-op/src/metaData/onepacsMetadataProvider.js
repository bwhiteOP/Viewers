/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

import OHIF from '@ohif/core';
import * as dicomModules from './dicomModules';

/**
 * Implement a cornerstone metadata provider.
 * @see https://docs.cornerstonejs.org/concepts/metadata-providers.html
 */
export function onepacsMetadataProvider(query, imageId) {
    const onepacsMetadata = getMetadataFromModule(query, imageId);
    return onepacsMetadata;
}

function getMetadataFromModule(moduleName, imageId) {
    const dicomModule = dicomModules[moduleName];
    if (!dicomModule)
        return;

    const { metadataProvider: ohifMetadataProvider } = OHIF.cornerstone;
    const instance = ohifMetadataProvider.getInstance(imageId);
    return dicomModule(imageId, instance);
}

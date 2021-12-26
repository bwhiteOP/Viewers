/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import OHIF from '@ohif/core';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { deserializePresentationState } from './deserializePresentationState';

const { utils: { sopClassDictionary }} = OHIF;

/**
 * Load DICOM Softcopy Presentation States
 * @param {types.OHIFStudy[]} studies Studies to load DICOM Softcopy Presentation State for
 */
export function loadPresentationStates(studies) {
    studies.forEach(study => {
        study.series.forEach(series => {
            series.instances.filter(isPresentationState).forEach(instance => 
                deserializePresentationState(instance, study));
        });
    });
}

/** @param {types.OHIFInstance} instance */
function isPresentationState(instance) {
    return instance.metadata.SOPClassUID === sopClassDictionary.GrayscaleSoftcopyPresentationStateStorage 
        || instance.metadata.SOPClassUID === sopClassDictionary.ColorSoftcopyPresentationStateStorage;
}


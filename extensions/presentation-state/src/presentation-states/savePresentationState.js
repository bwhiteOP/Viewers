/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import i18next from 'i18next';
import OHIF from '@ohif/core';
// eslint-disable-next-line no-unused-vars
import { types, log, routes, postAsync } from '@onepacs/core';
import { reduxUser } from '@onepacs/user';
import serializePresentationState from './serializePresentationState';

const route = routes.server.api.savePresentationState;

/**
 * Save DICOM Softcopy Presentation State to OPS for a cornerstone element
 * @param enabledElement Cornerstone element where the presentation state is saved
 * @returns {Promise<{ success: boolean, error?: any }>}.
 */
export async function savePresentationState(enabledElement) {
    const request = getPresentationStateRequest(enabledElement);
    if (!request) {
        return { success: false, error: i18next.t('PresentationState:MessageCreateFailed') };
    }

    /** @type {{ result?: types.SavePresentationStateResult, error?: Error}} */
    const { result, error } = await postAsync(route, request)
    if (error) {
        log.error(error);
        return { success: false, error };
    }

    return { success: !!result.success };
}

/**
 * @param {*} enabledElement 
 * @returns {types.SavePresentationStateRequest | undefined}
 */
function getPresentationStateRequest(enabledElement) {
    if (!enabledElement) {
        return;
    }

    const { viewport, canvas, image } = enabledElement;
    if (!viewport || !canvas || !image) {
        log.debug('savePresentationState: enabledElement viewport/canvas/image is empty');
        return;
    }

    //  Skip if it is WADO image
    if (image.wadoImage) {
        log.debug('savePresentationState: skip for wado image');
        return;
    }

    if (reduxUser.selectors.isUserExpired()) {
        log.warn('savePresentationState: session expired');
        return;
    }

    const instance = OHIF.cornerstone.metadataProvider.getInstance(image.imageId);
    if (!instance || !instance.StudyInstanceUID) {
        log.warn('savePresentationState: studyInstanceUid empty');
        return;
    }

    const prBuffer = serializePresentationState(enabledElement, instance);
    if (!prBuffer) {
        log.warn('savePresentationState: presentation state buffer empty');
        return;
    }

    // typed Uint8Array serialized into an object
    // Convert to regular array to avoid serialization problem.
    const prArray = Array.from(new Uint8Array(prBuffer));
    const user = reduxUser.selectors.getUser();
    const request = {
        userIdentity: user.identity,
        studyUid: instance.StudyInstanceUID,
        presentationState: prArray
    };
    
    return request;
}

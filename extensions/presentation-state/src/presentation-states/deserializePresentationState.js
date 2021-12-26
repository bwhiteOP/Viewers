/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import dicomParser from 'dicom-parser';
import OHIF from '@ohif/core';

// eslint-disable-next-line no-unused-vars
import { types, imageUtils } from '@onepacs/core';
import { imageDownloadUtils } from '@onepacs/cornerstone';
import { DicomColorSoftcopyPresentationState } from './DicomColorSoftcopyPresentationState';
import { DicomGrayscaleSoftcopyPresentationState } from './DicomGrayscaleSoftcopyPresentationState';

const { utils: { sopClassDictionary }} = OHIF;
const websocketScheme = 'websocket';

/**
 * 
 * @param {types.OHIFInstance} instance 
 * @param {types.OHIFStudy} study 
 * @returns 
 */
export function deserializePresentationState(instance, study) {
    //  Use websocket to download the instance
    const imageIds = imageUtils.parseImageId(instance.url);

    const websockImageId = imageIds.find(id => id.scheme === websocketScheme);
    if (!websockImageId) {
        return;
    }

    const { url, imageId } = websockImageId;
    downloadPresentationStateImage(url, imageId).then(dataSet => {
        let presentationState;
        if (instance.metadata.SOPClassUID === sopClassDictionary.GrayscaleSoftcopyPresentationStateStorage) {
            presentationState = new DicomGrayscaleSoftcopyPresentationState(dataSet);
        } else if (instance.metadata.SOPClassUID === sopClassDictionary.ColorSoftcopyPresentationStateStorage) {
            presentationState = new DicomColorSoftcopyPresentationState(dataSet);
        }

        const referencedImageInstances = getReferencedImageInstances(study, presentationState);
        referencedImageInstances.forEach(instance => associatePresentationStateToInstance(presentationState, instance));
    });
}

function associatePresentationStateToInstance(presentationState, instance) {
    const existingPresentationState = instance.presentationState;

    //  HV-256 Show only the latest saved PR
    if (existingPresentationState && existingPresentationState.getCreationDateTime() > presentationState.getCreationDateTime()) {
        return;
    }

    instance.setCustomAttribute('PresentationState', presentationState);

    // Fire ImageUpdated event to refresh the viewport where image is displayed
    // TODO: Session.set(`ImageUpdated${referencedImageInstance.getSOPInstanceUID()}`, Random.id());
}

function downloadPresentationStateImage(url, imageId) {
    const loadDICOMPromise = imageDownloadUtils.webSocketRequest(url, imageId);
    return new Promise((resolve, reject) => {
        loadDICOMPromise.then((dicomPart10AsArrayBuffer) => {
            try {
                const byteArray = new Uint8Array(dicomPart10AsArrayBuffer);
                const dataSet = dicomParser.parseDicom(byteArray);
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

function getReferencedImageInstances(study, presentationState) {
    const referencedImageInstances = [];

    const relationshipModule = presentationState && presentationState.getRelationshipModule();
    if (!relationshipModule || !relationshipModule.referencedImages) {
        return referencedImageInstances;
    }

    relationshipModule.referencedImages.forEach((referencedImage) => {
        const { seriesInstanceUid, sopInstanceUid } = referencedImage;
        const referencedImageInstance = getImage(study, seriesInstanceUid, sopInstanceUid);
        if (!referencedImageInstance) {
            return;
        }

        referencedImageInstances.push(referencedImageInstance);
    });

    return referencedImageInstances;
}

function getImage(study, seriesInstanceUid, sopInstanceUid) {
    const displaySets = study.displaySets.filter(ds => ds.SeriesInstanceUID === seriesInstanceUid);
    for (let i = 0; i < displaySets.length; i++) {
        const image = displaySets[i].images.find(img => img.getSOPInstanceUID() === sopInstanceUid);
        if (image) {
            return image;
        }
    }
}

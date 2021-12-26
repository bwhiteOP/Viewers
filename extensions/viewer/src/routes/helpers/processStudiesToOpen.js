/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 14, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, imageUtils } from '@onepacs/core';
import OHIF from '@ohif/core';
import { mapStudy } from './dicomMapper';
import { getApp } from '../../ohif';

/**
 * @typedef {Object} ProcessStudiesResult
 * @prop {types.OHIFStudy[]} studies
 * @prop {string[]} studyInstanceUIDs
 * @prop {string[]} seriesInstanceUIDs
 */

/**
 * @param {types.StudyToOpen[]} studiesToOpen
 * @returns {ProcessStudiesResult}
 */
export function processStudiesToOpen(studiesToOpen) {
    const studyInstanceUIDs = new Set();
    const seriesInstanceUIDs = new Set();
    const studies = studiesToOpen.flatMap(s => s.studies).map(mapStudy);

    // Parse data here and add to metadata provider.
    const { metadataProvider } = OHIF.cornerstone;
    studies.forEach(study => {
        const { series, ...studyMetadata } = study;
        studyInstanceUIDs.add(studyMetadata.StudyInstanceUID);

        study.series.forEach(series => {
            const { instances, ...seriesMetadata } = series;
            seriesInstanceUIDs.add(series.SeriesInstanceUID);

            series.instances.forEach((instance, imageIndex) => {
                const metadata = {
                    ...studyMetadata,
                    ...seriesMetadata,
                    ...instance.metadata,
                    numImages: series.instances.length,
                    imageIndex: imageIndex + 1
                };
                metadataProvider.addInstance(metadata);

                const instanceUids = {
                    StudyInstanceUID: metadata.StudyInstanceUID,
                    SeriesInstanceUID: metadata.SeriesInstanceUID,
                    SOPInstanceUID: metadata.SOPInstanceUID
                };

                // Associate the url and the actual imageIds with the set of instance uids.
                metadataProvider.addImageIdToUIDs(instance.url, instanceUids);
                imageUtils.parseImageId(instance.url).forEach(parsedImageId => {
                    metadataProvider.addImageIdToUIDs(parsedImageId.imageId, instanceUids);
                });
            });
        });
    });

    const { studies: updatedStudies } = mapStudiesToNewFormat(studies);

    return {
        studies: updatedStudies,
        studyInstanceUIDs: Array.from(studyInstanceUIDs),
        seriesInstanceUIDs: Array.from(seriesInstanceUIDs)
    };
}

/**
 * Map studies json to new format by registering with studyMetadataManager and adding the study.displaySets property.
 * Copied from function of the same name in OHIF StandaloneRouting.js
 * @see https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/viewer/src/routes/StandaloneRouting.js#L184
 * @param {types.OHIFStudy[]} studies
 * @returns {{
 *      studies: types.OHIFStudy[]
 * }}
 */
function mapStudiesToNewFormat(studies) {
    // @ts-ignore
    const { extensionManager } = getApp();
    const { metadata, utils } = OHIF;
    const { studyMetadataManager } = utils;
    const { OHIFStudyMetadata } = metadata;

    studyMetadataManager.purge();

    /* Map studies to new format, update metadata manager? */
    const updatedStudies = studies.map(study => {
        const studyMetadata = new OHIFStudyMetadata(study, study.StudyInstanceUID);
        const sopClassHandlerModules = extensionManager.modules['sopClassHandlerModule'];
        study.displaySets = study.displaySets || studyMetadata.createDisplaySets(sopClassHandlerModules);
        studyMetadataManager.add(studyMetadata);
        return study;
    });

    return {
        studies: updatedStudies
    };
}

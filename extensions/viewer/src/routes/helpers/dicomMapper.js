/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 14, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, dataUtils, imageUtils } from '@onepacs/core';

/**
 * Map OnePacs study to OHIF study
 * @param {types.Study} study
 * @returns {types.OHIFStudy}
 */
export function mapStudy(study) {
    const { date: studyDate, time: studyTime } = parseDateTime(study.studyDateUTC);
    /** @type {types.OHIFStudy} */
    return {
        StudyInstanceUID: study.studyInstanceUid,
        StudyDescription: study.studyDescription,
        StudyDate: studyDate,
        StudyTime: studyTime,
        StudyDateUTC: study.studyDateUTC, // keep this around to make Date.parse easier
        PatientName: study.patientName,
        PatientID: study.patientId,
        PatientSex: study.patientSex,
        PatientHistory: study.patientHistory,
        InstitutionName: study.institutionName,
        series: study.seriesList.map(s => mapSeries(study, s)),
    };
}

/**
 * Map OnePacs series to OHIF series
 * @param {types.Study} study
 * @param {types.Series} series
 * @returns {types.OHIFSeries}
 */
function mapSeries(study, series) {
    /** @type {types.OHIFSeries} */
    return {
        SeriesDescription: series.seriesDescription,
        SeriesInstanceUID: series.seriesInstanceUid,
        SeriesNumber: Number(series.seriesNumber),
        SeriesDate: undefined,
        SeriesTime: undefined,
        Modality: series.modality,
        instances: series.instances.map(i => mapInstance(study, series, i))
    };
}

/**
 * Map OnePacs instance to OHIF instance
 * @param {types.Study} study
 * @param {types.Series} series
 * @param {types.Instance} instance
 * @returns {types.OHIFInstance}
 */
function mapInstance(study, series, instance) {
    /** @type {types.OHIFInstance} */
    return {
        metadata: {
            Columns: undefined,
            Rows: undefined,
            InstanceNumber: Number(instance.instanceNumber),
            NumberOfFrames: instance.numberOfFrames,
            AcquisitionNumber: undefined,
            PhotometricInterpretation: undefined,
            BitsAllocated: undefined,
            BitsStored: undefined,
            PixelRepresentation: undefined,
            SamplesPerPixel: undefined,
            PixelSpacing: undefined,
            HighBit: undefined,
            ImageOrientationPatient: undefined,
            ImagePositionPatient: undefined,
            FrameOfReferenceUID: undefined,
            ImageType: undefined,
            Modality: series.modality,
            TransferSyntax: instance.transferSyntax,
            SOPInstanceUID: instance.sopInstanceUid,
            SOPClassUID: instance.sopClassUid,
            SeriesInstanceUID: series.seriesInstanceUid,
            StudyInstanceUID: study.studyInstanceUid
        },
        // TODO: Perhaps this should be done in getImageId method.
        url: imageUtils.combineImageUrls(instance.urls)
    };
}

/** @param {string} strDateTime */
function parseDateTime(strDateTime) {
    const result = dataUtils.parseDateTime(strDateTime);
    if (!result || typeof result === 'string') {
        return { date: undefined, time: undefined };
    } else {
        return result;
    }
}

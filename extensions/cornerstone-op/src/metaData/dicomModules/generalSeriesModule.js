/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

import dicomParser from 'dicom-parser';

/**
 * Extract the general series module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.3.html
 */
export function generalSeriesModule(imageId, instance) {
    if (!instance)
        return;

    const { SeriesDate, SeriesTime } = instance;

    let seriesDate;
    let seriesTime;

    if (SeriesDate) {
        seriesDate = dicomParser.parseDA(SeriesDate);
    }

    if (SeriesTime) {
        seriesTime = dicomParser.parseTM(SeriesTime);
    }

    return {
        modality: instance.Modality,
        seriesInstanceUID: instance.SeriesInstanceUID,
        seriesNumber: instance.SeriesNumber,
        seriesDescription: instance.SeriesDescription,
        seriesDate,
        seriesTime,
    };
}

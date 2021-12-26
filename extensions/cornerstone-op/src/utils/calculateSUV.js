/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 13, 2020 by Jay Liu
 */

/**
 * This module deals with calculating SUV
 * Overridden for the following specific features:
 *  - Calculate lean body mass (lbm)
 *  - Calculate body surface area (bsa)
 */
import cornerstone from 'cornerstone-core';

/**
 * Calculates a Standardized Uptake Value.
 * @export @public @method
 * @name calculateSUV
 *
 * @param  {Object} image            The image.
 * @param  {number} storedPixelValue The raw pixel value.
 * @param  {boolean} [skipRescale=fale]
 * @returns {{ bw: number, bsa: number, lbm: number}} The SUV.
 */
export function calculateSUV(image, storedPixelValue, skipRescale = false) {
    const patientMetadata = cornerstone.metaData.get('patient', image.imageId);
    const patientStudyModule = cornerstone.metaData.get('patientStudyModule', image.imageId);
    const seriesModule = cornerstone.metaData.get('generalSeriesModule', image.imageId);

    if (!patientStudyModule || !seriesModule) {
        return;
    }

    const {modality} = seriesModule;

    // Image must be PET
    if (modality !== 'PT') {
        return;
    }

    const modalityPixelValue = skipRescale
        ? storedPixelValue
        : storedPixelValue * image.slope + image.intercept;

    const patientSex = patientMetadata && patientMetadata.sex; // M or F
    const {patientWeight, patientSize} = patientStudyModule; // In kg and m

    if (!patientWeight) {
        return;
    }

    const petSequenceModule = cornerstone.metaData.get(
        'petIsotopeModule',
        image.imageId
    );

    if (!petSequenceModule) {
        return;
    }

    const {radiopharmaceuticalInfo} = petSequenceModule;
    const startTime = radiopharmaceuticalInfo.radiopharmaceuticalStartTime;
    const totalDose = radiopharmaceuticalInfo.radionuclideTotalDose;
    const halfLife = radiopharmaceuticalInfo.radionuclideHalfLife;
    const seriesAcquisitionTime = seriesModule.seriesTime;

    if (!startTime || !totalDose || !halfLife || !seriesAcquisitionTime) {
        return;
    }

    const acquisitionTimeInSeconds =
    fracToDec(seriesAcquisitionTime.fractionalSeconds || 0) +
    seriesAcquisitionTime.seconds +
    seriesAcquisitionTime.minutes * 60 +
    seriesAcquisitionTime.hours * 60 * 60;
    const injectionStartTimeInSeconds =
    fracToDec(startTime.fractionalSeconds) +
    startTime.seconds +
    startTime.minutes * 60 +
    startTime.hours * 60 * 60;
    const durationInSeconds =
    acquisitionTimeInSeconds - injectionStartTimeInSeconds;
    const correctedDose =
    totalDose * Math.exp((-durationInSeconds * Math.log(2)) / halfLife);
    //  Body Weight (bw)
    const bw = modalityPixelValue * patientWeight / correctedDose * 1000;

    let lbm;
    let bsa;
    if (patientSize) {
        //  Lean Body Mass (lbm)
        if (patientSex === 'M') {
            lbm = 1.10 * patientWeight - 120 * Math.pow((patientWeight / (patientSize * 100)), 2);
        } else if (patientSex === 'F') {
            lbm = 1.07 * patientWeight - 148 * Math.pow((patientWeight / (patientSize * 100)), 2);
        }
        lbm = modalityPixelValue * lbm / correctedDose * 1000;

        //  Body Surface Area (bsa)
        bsa = 71.84 * Math.pow((patientSize * 100), 0.725) * Math.pow(patientWeight, 0.425);
        bsa = modalityPixelValue * bsa / correctedDose;
    }

    return {
        bw,
        lbm,
        bsa
    };
}

/**
 * Returns a decimal value given a fractional value.
 * @private
 * @method
 * @name fracToDec
 *
 * @param  {number} fractionalValue The value to convert.
 * @returns {number}                 The value converted to decimal.
 */
function fracToDec(fractionalValue) {
    return parseFloat(`.${fractionalValue}`);
}

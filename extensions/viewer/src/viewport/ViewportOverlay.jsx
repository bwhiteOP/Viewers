/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

import './ViewportOverlay.styl';
import React from 'react';
import cornerstone from 'cornerstone-core';
import { OnePacsViewportOverlayClassName } from './constants';
import {
    formatPN,
    formatDA,
    formatNumberPrecision,
    formatTM,
    formatTZ,
    getViewport,
    getImage,
} from '../utils';
import {
    getCompression,
    getImageDimensions,
    ImageStatus,
    InstanceNumber,
    PatientHistory,
    PriorIndicator,
    getVoiLut
} from './helpers';

/* eslint-disable react/prop-types */

/**
 * Define an Overlay component to be rendered by CornerstoneViewport of react-cornerstone-viewport
 * @see https://github.com/cornerstonejs/react-cornerstone-viewport/blob/v4.0.4/src/CornerstoneViewport/CornerstoneViewport.js#L359
 * @param {{
 *  imageIndex: number,
 *  stackSize: number,
 *  scale: number,
 *  windowWidth: number,
 *  windowCenter: number,
 *  imageId: string,
 * }} props 
 */
export function ViewportOverlay({ imageIndex, stackSize, scale, windowWidth, windowCenter, imageId }) {
    const viewport = getViewport();
    const image = getImage();

    const patientModule = cornerstone.metaData.get('patientModule', imageId) || {};
    const { patientId, patientName, patientHistory } = patientModule;

    const patientStudyModule = cornerstone.metaData.get('patientStudyModule', imageId) || {};
    const { patientSex, patientAge } = patientStudyModule;

    const generalStudyModule = cornerstone.metaData.get('generalStudyModule', imageId) || {};
    const { studyInstanceUID, studyDate, studyTime, studyDescription, institutionName } = generalStudyModule;

    const generalSeriesModule = cornerstone.metaData.get('generalSeriesModule', imageId) || {};
    const { seriesNumber, seriesDescription } = generalSeriesModule;

    const generalImageModule = cornerstone.metaData.get('generalImageModule', imageId) || {};
    const { instanceNumber, acquisitionTime } = generalImageModule;

    const imagePlaneModule = cornerstone.metaData.get('imagePlaneModule', imageId) || {};
    const { sliceThickness, sliceLocationNormalized, spacingBetweenSlices } = imagePlaneModule;

    // const voiLutModule = cornerstone.metaData.get('voiLutModule', imageId) || {};

    const cineModule = cornerstone.metaData.get('cineModule', imageId) || {};
    const { frameTime } = cineModule;
    const frameRate = 1000 / frameTime;

    // Formatted values

    // HV-120 Show patient gender and age as a new viewport overlay along with patient name
    const patientGenderAge = `${patientSex || ''} ${patientAge || ''}`;

    const studyDateTime = `${formatDA(studyDate)} ${formatTM(studyTime)}${formatTZ(studyTime)}`;
    const zoomPercentage = formatNumberPrecision(scale * 100, 0);
    const compression = getCompression(generalImageModule, image);
    const wwwc = `W: ${windowWidth.toFixed(0)} L: ${windowCenter.toFixed(0)}`;
    const imageDimensions = getImageDimensions(imagePlaneModule, image);
    const voiLut = getVoiLut(viewport);

    return (
        <div className={OnePacsViewportOverlayClassName}>
            <div className="top-left overlay-element">
                <div className="patientName uppercase">{formatPN(patientName)}</div>
                <div className="patientId">{patientId}</div>
                <div className="patientGenderAge">{patientGenderAge}</div>
                <PatientHistory patientHistory={patientHistory} />
            </div>
            <div className="top-right overlay-element">
                <div className="studyDescription uppercase">{studyDescription}</div>
                <div className="studyDateTime">{studyDateTime}</div>
                <PriorIndicator studyInstanceUID={studyInstanceUID} />
                <div className="acquisitionTime">{acquisitionTime ? `Acq: ${formatTM(acquisitionTime, 'HH:mm:ss.SS')}` : ''}</div>
                <div className="sliceLocation">{sliceLocationNormalized ? `Loc: ${sliceLocationNormalized}` : ''}</div>
            </div>
            <div className="bottom-right overlay-element">
                <div className="institutionName">{institutionName}</div>
                <div className="zoom">Zoom: {zoomPercentage}%</div>
                <div className="compressionIndicator">{compression}</div>
                <div className="windowLevel">{voiLut ? voiLut : wwwc}</div>
            </div>
            <div className="bottom-left overlay-element">
                <ImageStatus imageId={imageId} />
                <div className="seriesNumber">{seriesNumber >= 0 ? `Ser: ${seriesNumber}` : ''}</div>
                <InstanceNumber imageId={imageId} instanceNumber={instanceNumber} imageIndex={imageIndex} />
                <div className="frameRate">{frameRate >= 0 ? `${formatNumberPrecision(frameRate, 2)} FPS` : ''}</div>
                <div className="imageDimensions">{imageDimensions}</div>
                <div>
                    <span className="sliceThickness">{sliceThickness ? `Thick: ${formatNumberPrecision(sliceThickness, 2)} mm` : ''}</span>
                    <span className="spacingBetweenSlices">{spacingBetweenSlices ? ` Spacing: ${formatNumberPrecision(spacingBetweenSlices, 2)} mm` : ''}</span>
                </div>
                <div className="seriesDescription uppercase">{seriesDescription}</div>
            </div>
        </div>
    );
}

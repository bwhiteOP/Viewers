/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { reduxUserPreferences } from '@onepacs/user';

// eslint-disable-next-line no-unused-vars
import { getActiveViewport, ViewportData } from '../../../redux/selectors/viewports';
import { setCine, setCineDialogVisible } from '../../../redux/actions';
import { useInitialImageLoaded } from './useInitialImageLoaded';
import { getDicomTag, getElement } from '../../../utils';

const { isUserPreferencesLoaded, getPreferences } = reduxUserPreferences.selectors;

export function useAutoPlayCineDialog() {
    const dispatch = useDispatch();

    const generalPreferences = useSelector(state => getPreferences(state, 'general'));
    const hasUserPreferences = useSelector(isUserPreferencesLoaded);

    const viewportData = useSelector(getActiveViewport);
    const hasViewport = viewportData !== undefined;

    /** @type {HTMLElement} */
    const activeEnabledElement = getElement();
    const hasEnabledElement = activeEnabledElement !== undefined;

    const isImageLoaded = useInitialImageLoaded();

    useEffect(() => {
        if (!hasUserPreferences) return; // wait for user preferences to be loaded
        if (!hasViewport) return; // wait for a viewport to be set
        if (!hasEnabledElement) return; // wait for an EnabledElement so we can get stack data
        if (!isImageLoaded) return;

        const { cine } = viewportData;
        if (cine) return; // nothing to do, already have cine data for the active viewport.

        const isPlaying = getDefaultIsPlaying(viewportData, generalPreferences);
        const cineFrameRate = getDefaultFrameRate(viewportData, activeEnabledElement);
        dispatch(setCine({ isPlaying, cineFrameRate }));
        if (isPlaying) {
            // show the cineDialog right away if true
            dispatch(setCineDialogVisible(true));
        }

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, hasUserPreferences, hasViewport, hasEnabledElement, isImageLoaded]);
}

/**
 * Gets the default behaviour of autoplay cine
 * @param {ViewportData} viewportData 
 * @param {*} generalPreferences 
 * @returns {boolean}
 */
function getDefaultIsPlaying(viewportData, generalPreferences) {
    let isPlaying = false;
    if (viewportData.isMultiFrame) {
        isPlaying = viewportData.numImageFrames > 1 && generalPreferences.MultiframeAutoPlayCineEnabled;
    }
    return isPlaying;
}

/**
 * Gets the default frame rate for autoplay cine
 * @param {ViewportData} viewportData 
 * @param {HTMLElement} activeEnabledElement 
 * @returns {number}
 */
function getDefaultFrameRate(viewportData, activeEnabledElement) {
    let cineFrameRate = 24; // default single frame frame-rate
    if (viewportData.frameRate !== undefined) {
        cineFrameRate = viewportData.frameRate > 0
            ? viewportData.frameRate
            : 12; // multiframe with no specified frame rate
    } else {
        // frameRate is not defined in metadata.  Try getting it from DICOM tag.
        cineFrameRate = getFrameRateFromDicomTag(activeEnabledElement) || cineFrameRate;
    }

    return cineFrameRate;
}

function getFrameRateFromDicomTag(activeEnabledElement) {
    const frameTime = getDicomTag('FrameTime', activeEnabledElement);
    if (!frameTime) return;
    return 1000/frameTime;
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

import _ from 'lodash';
import OHIF from '@ohif/core';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUserPreferences } from '@onepacs/user';
import { getViewports, getCine } from './selectors/viewports';
import { getCineDialogVisible } from './selectors/extensions';

const { setViewportSpecificData, setExtensionData } = OHIF.redux.actions;

const { getPreferences } = reduxUserPreferences.selectors;
const { saveUserPreferences } = reduxUserPreferences.actions;

export const applyToolset = (index = 0) => {
    return function (dispatch, getState) {
        const { toolsets } = getPreferences(getState(), 'mouseToolsets');
        if (index >= 0 && index < toolsets.length) {
            /** @type {types.UserPreferences} */
            const updatedUserPreferences = {
                mouseToolsets: {
                    activeIndex: index,
                    toolsets
                }
            };
            dispatch(saveUserPreferences(updatedUserPreferences));
        }
    }
}

export const toggleToolset = () => {
    return function (dispatch, getState) {
        const { activeIndex, toolsets } = getPreferences(getState(), 'mouseToolsets');
        if (toolsets.length < 2)
            return; // nothing to do

        const nextIndex = (activeIndex + 1) >= toolsets.length ? 0 : (activeIndex + 1);
        dispatch(applyToolset(nextIndex));
    }
}

export const toggleScaleOverlay = () => {
    return function (dispatch, getState) {
        const { ScaleOverlayEnabled: showScaleOverlay } = getPreferences(getState(), 'general');
        const updatedUserPreferences = {
            general: {
                ScaleOverlayEnabled: !showScaleOverlay
            }
        };
        dispatch(saveUserPreferences(updatedUserPreferences));
    }
}

export const toggleCineDialog = () => {
    return function (dispatch, getState) {
        const visible = getCineDialogVisible(getState());
        dispatch(setExtensionData('cineDialog', { visible: !visible }));
    }
}

/**
 * Sets the visibility of the CINE dialog.
 * @param {*} visible
 */
export const setCineDialogVisible = (visible) => {
    return function (dispatch) {
        dispatch(setExtensionData('cineDialog', { visible }));
    }
}

export const toggleCinePlay = () => {
    return function (dispatch, getState) {
        const isPlaying = getCine(getState())?.isPlaying;
        dispatch(setCine({ isPlaying: !isPlaying }));
    }
}

export const setCine = (newCine) => {
    return function (dispatch, getState) {
        const state = getState();
        const { activeViewportIndex } = getViewports(state);
        const currentCine = getCine(state)
        const cine = _.merge({}, currentCine, newCine);
        dispatch(setViewportSpecificData(activeViewportIndex, { cine }));
    }
}

export const stopAllCine = () => {
    return function (dispatch, getState) {
        const state = getState();
        const { viewportSpecificData } = getViewports(state);

        Object.values(viewportSpecificData).forEach((viewportData, viewportIndex) => {
            if (viewportData.cine) {
                const cine = _.merge({}, viewportData.cine, { isPlaying: false });
                dispatch(setViewportSpecificData(viewportIndex, { cine }));
            }
        });
    }
}

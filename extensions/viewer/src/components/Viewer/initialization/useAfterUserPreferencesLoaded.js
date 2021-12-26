/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import cornerstoneTools from 'cornerstone-tools';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import {
    reduxUserPreferences,
    getHotkeysFromPreferences,
} from '@onepacs/user';
import {
    addAndActivateTool,
    updateToolConfiguration,
    toolsMapping,
} from '@onepacs/cornerstone';
import { getApp } from '../../../ohif';

const { hotkeysManager, commandsManager } = getApp();

const { isUserPreferencesLoaded, getUserPreferences } = reduxUserPreferences.selectors;

/**
 * A custom hook that runs after user preferences is loaded.
 * @returns {{ viewportStyle: React.CSSProperties | undefined }}
 */
export function useAfterUserPreferencesLoaded() {
    const [state, setState] = useState({
        viewportStyle: undefined
    });
    const hasUserPreferences = useSelector(isUserPreferencesLoaded);

    /** @type {types.UserPreferences} */
    const userPreferences = useSelector(getUserPreferences);
    const { general, suv, annotation, hotKeys, mouseToolsets } = userPreferences;

    const {
        ScaleOverlayEnabled: showScaleOverlay,
        MeasurementPrecision: precision
    } = general;

    const {
        SuvBwEnabled: showSUVBw,
        SuvBsaEnabled: showSUVBsa,
        SuvLbmEnabled: showSUVLbm,
    } = suv;

    const {
        FontSizeScale: viewportFontSizeScale
    } = annotation;

    const {
        activeIndex,
        toolsets
    } = mouseToolsets;

    // Update active tools when toolset activeIndex changes
    useEffect(() => {
        if (!hasUserPreferences) return;

        function setToolActive(toolsetToolName, mouseButtonMask) {
            const toolName = toolsMapping[toolsetToolName];
            commandsManager.runCommand('setToolActive', { toolName, mouseButtonMask });
        }

        const toolset = toolsets[activeIndex];
        if (toolset) {
            setToolActive(toolset.Left, 1);
            setToolActive(toolset.Right, 2);
            setToolActive(toolset.Middle, 4);
        }
    // purposely not including toolsets as dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasUserPreferences, activeIndex])

    // Update viewport overlay font scale when preference changes.
    useEffect(() => {
        if (!hasUserPreferences) return;
        // Specify the viewport overlay font scale sizes
        const viewportFontSizeEm = (viewportFontSizeScale / 100).toFixed(1);
        const viewportStyle = /** @type {React.CSSProperties} */ ({ '--viewportOverlayFontScale': `${viewportFontSizeEm}em` });
        setState({ viewportStyle });
    }, [hasUserPreferences, viewportFontSizeScale])

    // Toggle scale overlay when preferences changes
    useEffect(() => {
        if (!hasUserPreferences) return;
        addAndActivateTool('ScaleOverlay', cornerstoneTools.ScaleOverlayTool, {}, showScaleOverlay);
    }, [hasUserPreferences, showScaleOverlay])

    // Update measurement presicion for OnePacs LengthTool
    useEffect(() => {
        if (!hasUserPreferences) return;
        updateToolConfiguration(toolsMapping.length, { precision });
    }, [hasUserPreferences, precision])

    // Update ROI tool callout with SUV measurements.
    useEffect(() => {
        if (!hasUserPreferences) return;
        updateToolConfiguration(toolsMapping.ellipticalRoi, { showSUVBw, showSUVBsa, showSUVLbm });
    }, [hasUserPreferences, showSUVBw, showSUVBsa, showSUVLbm])

    // Update hotkeys when preference changes
    useEffect(() => {
        if (!hasUserPreferences) return;
        const updatedHotkeys = getHotkeysFromPreferences(hotkeysManager.hotkeyDefinitions, hotKeys);
        hotkeysManager.setHotkeys(updatedHotkeys);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasUserPreferences, hotKeys]);


    return state;
}

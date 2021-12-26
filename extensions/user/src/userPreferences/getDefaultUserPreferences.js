/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, publicSettings } from '@onepacs/core';
import { hotkeysDefaultPreferences } from './hotkeys/hotkeysDefaultPreferences';

/**
 * Get a deep clone of the default user preferences.
 * This guarantee that the actual default is never changed.
 */
export function getDefaultUserPreferences() {
    return _getDefaults();
}

/**
 * @template {keyof types.UserPreferences} T
 * @param {T} key
 * @returns {types.UserPreferences[T]}
 */
export function getDefaultPreferences(key) {
    return _getDefaults()[key];
}

/** @returns {types.UserPreferences} */
function _getDefaults() {
    const cachedSettings = publicSettings.cached();

    /** @type {types.UserPreferences} */
    return {
        advanced: {
            BandwidthSavingModeEnabled: false,
            WebGLEnabled: cachedSettings.ui.cornerstoneRenderer === 'webgl',
            PathologyEnabled: false
        },

        annotation: {
            FontSizeScale: 100
        },

        general: {
            ScaleOverlayEnabled: false,
            MultiframeAutoPlayCineEnabled: true,
            MeasurementPrecision: 1
        },

        hotKeys: hotkeysDefaultPreferences,

        layout:  [
            { modality: 'CR', rows: 1, columns: 1 },
            { modality: 'CT', rows: 1, columns: 1 },
            { modality: 'DX', rows: 1, columns: 1 },
            { modality: 'ES', rows: 1, columns: 1 },
            { modality: 'KO', rows: 1, columns: 1 },
            { modality: 'MG', rows: 1, columns: 1 },
            { modality: 'MR', rows: 1, columns: 1 },
            { modality: 'NM', rows: 1, columns: 1 },
            { modality: 'OT', rows: 1, columns: 1 },
            { modality: 'PR', rows: 1, columns: 1 },
            { modality: 'PT', rows: 1, columns: 1 },
            { modality: 'RF', rows: 1, columns: 1 },
            { modality: 'SC', rows: 1, columns: 1 },
            { modality: 'US', rows: 1, columns: 1 },
            { modality: 'XA', rows: 1, columns: 1 },
            { modality: 'OTHER', rows: 1, columns: 1 },
        ],

        mouseToolsets: {
            activeIndex: 0,
            toolsets: [{
                Left: (cachedSettings.defaultMouseButtonTools && cachedSettings.defaultMouseButtonTools.left),
                Middle: (cachedSettings.defaultMouseButtonTools && cachedSettings.defaultMouseButtonTools.middle),
                Right: (cachedSettings.defaultMouseButtonTools && cachedSettings.defaultMouseButtonTools.right)
            }]
        },

        seriesPanel: {
            isVisible: true
        },

        panel: {
            left: { isOpen: true, panel: 'studies' },
            right: { isOpen: false, panel: undefined },
        },

        suv: {
            SuvBwEnabled: true,
            SuvBsaEnabled: true,
            SuvLbmEnabled: true
        },

        wlPresets: {
            0: { id: 'SoftTissue', wc: 40, ww: 400 },
            1: { id: 'Lung', wc: -600, ww: 1500 },
            2: { id: 'Liver', wc: 90, ww: 150 },
            3: { id: 'Bone', wc: 480, ww: 2500 },
            4: { id: 'Brain', wc: 40, ww: 80 },
            5: {},
            6: {},
            7: {},
            8: {},
            9: {}
        }
    };
}

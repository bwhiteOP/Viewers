/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 20, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * @typedef {{
 *   viewports: {
 *     [viewportIndex: number]: { plugin: string }
 *   }
 * }} ViewportLayout
 * 
 * @typedef {{
 *   isPlaying: boolean,
 *   cineFrameRate: number
 * }} CineData
 * 
 * @typedef {{
 *   displaySetInstanceUID: string,
 *   StudyInstanceUID: string,
 *   SeriesInstanceUID: string,
 *   SeriesNumber: number,
 *   SeriesDescription: string,
 *   numImageFrames: number,
 *   Modality: string,
 *   isMultiFrame: boolean,
 *   InstanceNumber: number,
 *   isReconstructable: boolean,
 *   sopClassUIDs: string[],
 *   plugin: string,
 *   frameRate?: number,
 *   cine?: CineData
 * }} ViewportData
 * 
 * @typedef {{
 *  numRows: number,
 *  numColumns: number,
 *  activeViewportIndex: number,
 *  layout: ViewportLayout,
 *  viewportSpecificData: { [viewportIndex: number]: ViewportData}
 * }} ViewportsState
 */

/**
 * @param {*} state
 */
export function getViewports(state) {
    return /** @type {ViewportsState} */ (state.viewports);
}

/**
 * Get all the viewport data for the active viewport.
 * @param {*} state
 * @returns {ViewportData | undefined} undefined means the viewport does not yet exist.
 */
export function getActiveViewport(state) {
    const { viewportSpecificData, activeViewportIndex } = getViewports(state);
    return viewportSpecificData[activeViewportIndex];
}

/**
 * Get the cine data for the active viewport.
 * @param {*} state
 * @returns {CineData | undefined}
 */
export function getCine(state) {
    return getActiveViewport(state)?.cine;
}

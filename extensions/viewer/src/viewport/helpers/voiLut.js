/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 31, 2021 by Jay Liu
 */

/**
 * Gets the formatted VOI Lut description of a viewport.
 * @param {*} viewport 
 * @returns {string}
 */
export function getVoiLut(viewport) {
    if (!viewport || !viewport.voiLUT)
        return;

    // HV-356 Show VOI Lut information if VOI Lut is being used.
    return viewport.voiLUT.description
        ? `VOI LUT: ${viewport.voiLUT.description}`
        : 'VOI LUT';
}

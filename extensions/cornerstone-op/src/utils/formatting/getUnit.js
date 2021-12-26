/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

/**
 * Determine the proper unit for a measurement
 * @param {string} modality
 * @param {boolean} showHounsfieldUnits
 */
export function getUnit(modality, showHounsfieldUnits) {
    return modality === 'CT' && showHounsfieldUnits !== false ? 'HU' : '';
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 12, 2020 by Jay Liu
 */

/**
 * Override readonly module functions
 * @param {Object} obj Object to override property value
 * @param {string} prop Property to be overridden
 * @param {Object} value Property value to override
 */
export function override(obj, prop, value) {
    Object.defineProperty(obj, prop, { value });
}

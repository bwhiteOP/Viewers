/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

/**
 * Formats a patient name for display purposes
 * @see https://github.com/cornerstonejs/react-cornerstone-viewport/blob/v4.0.5/src/helpers/formatPN.js
 * @param {string} name
 * @returns {string | undefined}
 */
export function formatPN(name) {
    if (!name) {
        return;
    }

    // Convert the first ^ to a ', '. String.replace() only affects
    // the first appearance of the character.
    const commaBetweenFirstAndLast = name.replace('^', ', ');

    // Replace any remaining '^' characters with spaces
    const cleaned = commaBetweenFirstAndLast.replace(/\^/g, ' ');

    // Trim any extraneous whitespace
    return cleaned.trim();
}

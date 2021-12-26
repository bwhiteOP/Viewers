/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

import moment from 'moment';
import momentTz from 'moment-timezone';

/**
 * Format time string.
 * Copied from react-cornerstone-viewport
 * @see https://github.com/cornerstonejs/react-cornerstone-viewport/blob/v4.0.5/src/helpers/formatTM.js
 * @param {string} time 
 * @param {string} strFormat 
 * @returns {string | undefined}
 */
export function formatTM(time, strFormat = 'HH:mm:ss z') {
    if (!time) {
        return;
    }

    // DICOM Time is stored as HHmmss.SSS, where:
    //      HH 24 hour time:
    //      m mm    0..59   Minutes
    //      s ss    0..59   Seconds
    //      S SS SSS    0..999  Fractional seconds
    //
    // Goal: '24:12:12'
    try {
        const dateTime = moment(time, 'HHmmss.SSS');
        let formatted = dateTime.format(strFormat);
        return formatted;
    } catch (err) {
        // swallow?
    }

    return;
}

export function formatTZ(time) {
    if (!time) {
        return;
    }

    const parts = time.split(' ');
    if (parts.length > 1)
        return parts[1];

    // Guess local timezone
    const timezone = momentTz.tz.guess();
    if (timezone) {
        return momentTz.tz(timezone).format(' z');
    }
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

import moment from 'moment';

/**
 * Format date string.
 * Copied from react-cornerstone-viewport
 * @see https://github.com/cornerstonejs/react-cornerstone-viewport/blob/v4.0.5/src/helpers/formatDA.js
 * @param {string} date 
 * @param {string} strFormat 
 * @returns {string | undefined}
 */
export function formatDA(date, strFormat = 'MMM D, YYYY') {
    if (!date) {
        return;
    }

    // Goal: 'Apr 5, 1999'
    try {
        const dateTime = moment(date, 'YYYYMMDD');
        const formattedDateTime = dateTime.format(strFormat);
        return formattedDateTime;
    } catch (err) {
        // swallow?
    }

    return;
}

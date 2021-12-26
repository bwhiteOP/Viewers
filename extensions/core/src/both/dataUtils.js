/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 14, 2020 by Jay Liu
 */

// @ts-check
import momentTz from 'moment-timezone';

/**
 * @typedef {{date: string, time: string}} DateTimeObject
 */

export const dataUtils = {
    /**
     * Parses the datetime string, and returns date and time strings separately
     * @param {string} strDateTime The datetime string to be parsed
     * @returns {DateTimeObject | string}
     */
    parseDateTime: function(strDateTime) {
        if (!strDateTime) {
            return strDateTime;
        }

        const dateTime = new Date(strDateTime);

        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();

        /** @type {DateTimeObject} */
        const result = {};

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            result.date = strDateTime;
            return result;
        }

        result.date = year + paddingLeft('00', month) + paddingLeft('00', day);

        const hour = dateTime.getHours();
        const minute = dateTime.getMinutes();
        const second = dateTime.getSeconds();
        const millisecond = dateTime.getMilliseconds();

        result.time = `${paddingLeft('00', hour) + paddingLeft('00', minute) +
            paddingLeft('00', second)}.${paddingLeft('000', millisecond)}`;

        //  HV-245 Add timezone since it is converted to local timezone
        const timezone = momentTz.tz.guess();
        if (timezone) {
            result.time += ` ${momentTz.tz(timezone).format('z')}`;
        }

        return result;
    },

    /**
     * Formats Patient Name
     * @param {string} patientName Patient Name to be formatted
     * @returns {string} Formatted Patient Name
     */
    formatPatientName: function(patientName) {
        if (!patientName) {
            return patientName;
        }

        const components = patientName.split('^');

        const familyName = components[0] || '';
        const givenName = components[1] || '';
        const middleName = components[2] || '';

        let separator = '';
        if (familyName && (givenName || middleName)) {
            separator = ',';
        }

        return `${familyName}${separator} ${givenName} ${middleName}`;
    },

};

/**
 * Pad a string with the padding value.
 * @param {string} paddingValue
 * @param {string | number} toBePadded
 */
function paddingLeft(paddingValue, toBePadded) {
    return String(paddingValue + toBePadded).slice(-paddingValue.length);
}

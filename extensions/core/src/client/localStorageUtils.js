/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 14, 2020 by Jay Liu
 */

import { log } from '../both/log';

export const storageKeys = {
    StudyMetadataRequests: 'OPWEBV-studyMetadataRequests',
    UserIdentity: 'OPWEBV-userIdentity'
}

/**
 * Local storage accessor for a specified key.
 * @param {string} key
 */
export const localStorageUtils = function(key) {
    return {

        /**
         * Try to get localStorage value.
         * @param {any=} defaultValue Optional default value
         * @returns {any} The value in localStorage, fallback to `defaultValue` if provided.
         */
        tryGet: function(defaultValue) {
            try {
                // Get from local storage by key
                const item = window.localStorage.getItem(key);

                // Parse stored json or if none return defaultValue
                return item ? JSON.parse(item) : defaultValue;
            } catch (ex) {
                log.error(ex);
                return defaultValue;
            }
        },

        /**
         * Store the value into localStorage 
         * @param {*} value 
         * @returns {boolean} True if the storage is successful.
         */
        trySet: function(value) {
            try {
                if (!value) {
                    return false;
                }

                window.localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (ex) {
                log.error(ex);
                return false;
            }
        },

        /**
         * Remove the value of the specified key.
         */
        clear() {
            window.localStorage.removeItem(key);
        }
    };
}

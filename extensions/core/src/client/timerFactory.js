/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 14, 2020 by Jay Liu
 */

/**
 * A wrapper around setInterval and clearInterval so the consumer
 * doesn't have to keep track of the handle.
 * @param {Function} callback
 */
export const timerFactory = function(callback) {
    let handle; // private

    return {
        /**
         * Start the timer
         * @param {number} duration in ms
         */
        start: function (duration) {
            if (handle) {
                clearInterval(handle); // stop first
            }
            handle = setInterval(callback, duration);
        },

        /**
         * Stop the timer.
         */
        stop: function () {
            if (handle === undefined) return;

            clearInterval(handle);
            handle = undefined;
        }
    };
}

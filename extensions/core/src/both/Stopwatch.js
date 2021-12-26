/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

/**
 * A stopwatch class that can run on both server/client.
 * 
 * The server uses the performance API
 * @see https://nodejs.org/api/perf_hooks.html
 * 
 * The client uses the Window.performance object.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/performance
 */
export class Stopwatch {
    constructor() {
        this.startTime = undefined;
    }

    /**
     * @returns {boolean} true if the stop watch is currently running, false otherwise.
     */
    get isRunning() {
        return this.startTime !== undefined;
    }

    /**
     * Records the start time.
     */
    start() {
        const now = window ? window.performance.now() : performance.now();
        this.startTime = now;
    }

    /**
     * Take a peek at the current elapsed time. Keep the timer running.
     * @returns {number} the duration in ms.
     */
    peek() {
        const now = window ? window.performance.now() : performance.now();
        return now - this.startTime;
    }

    /**
     * Stop the timer.
     * @returns {number} the duration in ms.
     */
    stop() {
        const duration = this.peek();
        this.startTime = undefined;
        return duration;
    }
}

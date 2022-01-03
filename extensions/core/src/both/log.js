/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 14, 2020 by Jay Liu
 */

/**
 * A wrapper for console logs.
 * Adds color
 */
//import chalk from 'chalk';

export const log = {
    info: console.log,
    trace: console.trace,
    debug: console.log,
    warn: console.warn,
    error: console.error,
    time: console.time,
    timeEnd: console.timeEnd
};

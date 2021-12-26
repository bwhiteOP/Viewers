/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 14, 2020 by Jay Liu
 */

/**
 * A wrapper for console logs.
 * Adds color
 */
import chalk from 'chalk';

export const log = {
    info: console.log,
    trace: console.trace,
    debug: console.log.bind(console, chalk.blue('%s')),
    warn: console.warn.bind(console, chalk.yellow('%s')),
    error: console.error.bind(console, chalk.red('%s')),
    time: console.time,
    timeEnd: console.timeEnd
};

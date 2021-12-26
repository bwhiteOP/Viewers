/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import init from './init';
import commandsModule from './commands/commandsModule';

/** @type {types.Extension} */
export const cornerstoneExtension = {
    id: 'onepacs-cornerstone-extension',

    preRegistration(params) {
        init(params);
    },

    getCommandsModule(params) {
        return commandsModule(params);
    }
};

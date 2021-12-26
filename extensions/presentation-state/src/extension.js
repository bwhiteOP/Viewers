/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import commandsModule from './commands/commandsModule';

/** @type {types.Extension} */
export const presentationStateExtension = {
    id: 'onepacs-presentation-state-extension',

    getCommandsModule(params) {
        return commandsModule(params);
    },
};

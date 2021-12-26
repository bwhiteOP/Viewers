/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { initMeasurementApi, initToolContextMenu } from './init';
import commandsModule from './commands/commandsModule';
import toolbarModule from './toolbar/toolbarModule';
import routesModule from './routes/routesModule';
import viewportModule from './viewport/viewportModule';

/** @type {types.Extension} */
export const viewerExtension = {
    id: 'onepacs-viewer-extension',

    preRegistration(params) {
        initMeasurementApi();
        initToolContextMenu(params);
    },

    getCommandsModule(params) {
        return commandsModule(params);
    },

    getToolbarModule(params) {
        const { appConfig } = params;
        if (appConfig.onePacs.useOnePacs) {
            return toolbarModule(params);
        }
    },

    // @ts-ignore purposely return no viewportModule.
    getViewportModule() {
        viewportModule();
    },

    getRoutesModule() {
        return routesModule;
    }
};

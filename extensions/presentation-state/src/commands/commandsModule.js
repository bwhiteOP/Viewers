/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import i18next from 'i18next';
import cornerstone from 'cornerstone-core';
// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { savePresentationState } from '../presentation-states';

/**
 * @param {types.ModuleFunctionParameters} params
 * @returns {types.CommandsModule}
 */
export default function commandsModule(params) {
    const { servicesManager } = params;

    /** @type {types.Dictionary<types.CommandAction>} */
    const actions = {
        savePresentationState: ({ viewports }) => {
            const { UINotificationService } = servicesManager.services;
            const { activeViewportIndex } = viewports;
            const enabledElement = cornerstone.getEnabledElements()[activeViewportIndex];
            savePresentationState(enabledElement)
                .then(result => {
                    if (result.success) {
                        UINotificationService.show({
                            title: i18next.t('PresentationState:Title'),
                            message: i18next.t('PresentationState:MessageSaveSuccess'),
                        });
                    } else {
                        UINotificationService.show({
                            title: i18next.t('PresentationState:Title'),
                            message: i18next.t('PresentationState:MessageSaveFailed'),
                            type: 'error',
                            error: result.error
                        });
                    }
                }, error => {
                    UINotificationService.show({
                        title: i18next.t('PresentationState:Title'),
                        message: i18next.t('PresentationState:MessageSaveFailed'),
                        type: 'error',
                        error: error
                    });
                });
        },
    };

    /** @type {types.Dictionary<types.CommandDefinition>} */
    const definitions = {
        savePR: {
            commandFn: actions.savePresentationState,
            storeContexts: ['viewports'],
            options: {},
        },
    };

    return {
        actions,
        definitions,
        defaultContext: 'VIEWER'
    };
}

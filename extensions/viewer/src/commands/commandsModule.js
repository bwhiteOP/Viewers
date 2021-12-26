/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 17, 2020 by Jay Liu
 */

import cornerstone from 'cornerstone-core';

// eslint-disable-next-line no-unused-vars
import { types, getStore } from '@onepacs/core';
import { UserPreferences } from '../components/UserPreferences';
import { AboutContent } from '../components/Logo/AboutContent';
import { OnePacsViewportOverlayClassName } from '../viewport/constants';
import {
    toggleCineDialog,
    toggleCinePlay,
    applyToolset,
    toggleToolset,
    toggleScaleOverlay
} from '../redux/actions';

/**
 * @param {types.ModuleFunctionParameters} params
 * @returns {types.CommandsModule}
 */
export default function commandsModule(params) {
    const { servicesManager, commandsManager } = params;

    /** @type {types.Dictionary<types.CommandAction>} */
    const actions = {
        pan: ({ x = 0, y = 0 }) => {
            const enabledElement = getEnabledElement();
            if (enabledElement) {
                let viewport = cornerstone.getViewport(enabledElement);
                viewport.translation.x += (x * 5);
                viewport.translation.y += (y * 5);
                cornerstone.setViewport(enabledElement, viewport);
            }
        },

        applyToolset: ({ index = 0 }) => {
            const store = getStore();
            store.dispatch(applyToolset(index));
        },

        toggleToolset: () => {
            const store = getStore();
            store.dispatch(toggleToolset());
        },

        toggleScaleOverlay: () => {
            const store = getStore();
            store.dispatch(toggleScaleOverlay());
        },

        toggleOverlayTags: () => {
            const enabledElement = getEnabledElement();
            if (enabledElement) {
                const viewportElement = enabledElement.getElementsByClassName(OnePacsViewportOverlayClassName)[0];
                viewportElement.classList.toggle('hidden');
            }
        },

        toggleCinePlay: () => {
            const store = getStore();
            store.dispatch(toggleCinePlay());
        },

        toggleCineDialog: () => {
            const store = getStore();
            store.dispatch(toggleCineDialog());
        },

        showUserPreferences: () => {
            const { UIModalService } = servicesManager.services;
            if (UIModalService) {
                UIModalService.show({
                    title: 'User Preferences',
                    content: UserPreferences,
                    contentProps: {
                        onClose: UIModalService.hide,
                    },
                    customClassName: 'OnePacsUserPreferencesModal'
                });
            }
        },

        showAbout: () => {
            const { UIModalService } = servicesManager.services;
            if (UIModalService) {
                UIModalService.show({
                    title: 'About',
                    content: AboutContent
                });
            }
        }
    };

    /** @type {types.Dictionary<types.CommandDefinition>} */
    const definitions = {
        defaultToolset: execAction(actions.applyToolset, { index: 0 }),
        toggleToolset: execAction(actions.toggleToolset),
        toggleScaleOverlay: execAction(actions.toggleScaleOverlay),
        toggleOverlayTags: execAction(actions.toggleOverlayTags),
        toggleCinePlay: execAction(actions.toggleCinePlay),
        toggleCineDialog: execAction(actions.toggleCineDialog),
        showUserPreferences: execAction(actions.showUserPreferences),
        showAbout: execAction(actions.showAbout),
        panToLeft: execAction(actions.pan, { x: -1 }),
        panToRight: execAction(actions.pan, { x: 1 }),
        panToUp: execAction(actions.pan, { y: -1 }),
        panToDown: execAction(actions.pan, { y: 1 }),
    };

    function execAction(action, options = {}) {
        return {
            commandFn: action,
            storeContexts: [],
            options,
        };
    }

    function getEnabledElement() {
        return commandsManager.runCommand('getActiveViewportEnabledElement', {}, 'ACTIVE_VIEWPORT::CORNERSTONE');
    }

    return {
        actions,
        definitions,
        defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE'
    };
}

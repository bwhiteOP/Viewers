/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, getState } from '@onepacs/core';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '../toolsMapping';

const scrollToIndex = cornerstoneTools.import('util/scrollToIndex');

/**
 * @param {types.ModuleFunctionParameters} params
 * @returns {types.CommandsModule}
 */
export default function commandsModule(params) {
    const { commandsManager } = params;

    /** @type {types.Dictionary<types.CommandAction>} */
    const actions = {

        setToolActive: ({ toolName, mouseButtonMask = 1 }) => {
            if (!toolName) {
                console.warn('No toolname provided to setToolActive command');
            }
            cornerstoneTools.setToolActive(toolName, {
                mouseButtonMask: mouseButtonMask,
            });
        },

        /**
         * Jump to the first image of this stack.
         */
        firstImage: () => {
            const enabledElement = getEnabledElement();
            scrollToIndex(enabledElement, 0);
        },

        /**
         * Jump to the last image of this stack
         */
        lastImage: () => {
            const enabledElement = getEnabledElement();
            scrollToIndex(enabledElement, -1);
        },

        /**
         * Set the window/level values to default of the current image.
         * @param {*} param0 
         */
        setWindowLevelDefault: ({ viewports }) => {
            const { activeViewportIndex } = viewports;
            const enabledElement = cornerstone.getEnabledElements()[activeViewportIndex];

            if (enabledElement && enabledElement.image) {
                commandsManager.runCommand('setWindowLevel', {
                    viewports,
                    window: enabledElement.image.windowWidth,
                    level: enabledElement.image.windowCenter,
                    voiLUT: enabledElement.image.voiLUT
                });
            }
        },

        /**
         * Set the window/level values to a predefined preset.
         * @param {*} param0 
         */
        setWindowLevelPreset: ({ viewports, preset: presetKey }) => {
            const { preferences = {} } = getState();
            const preset = preferences.windowLevelData && preferences.windowLevelData[presetKey];

            if (preset && preset.window && preset.level) {
                commandsManager.runCommand('setWindowLevel', {
                    viewports,
                    window: preset.window,
                    level: preset.level,
                    voiLUT: undefined,
                });
            }
        },

        /**
         * Set the window/level valuesof the current image.
         * @param {*} param0 
         */
        setWindowLevel: ({ viewports, window, level, voiLUT }) => {
            const enabledElement = getEnabledElement();
            if (enabledElement) {
                let viewport = cornerstone.getViewport(enabledElement);

                viewport.voi = {
                    windowWidth: Number(window),
                    windowCenter: Number(level),
                };
                viewport.voiLUT = voiLUT;

                cornerstone.setViewport(enabledElement, viewport);
            }
        },

        /**
         * The `clearAnnotations` action in the Viewers commandsModule clear the tools via MeasurementApi.
         * Since we set 'disableMeasurementPanel' to false in the appConfig, this method allows user to 
         * clear all annotation tools
         */
        clearTools: ({ viewports }) => {
            const { activeViewportIndex } = viewports;
            const enabledElement = cornerstone.getEnabledElements()[activeViewportIndex];
            if (!enabledElement || !enabledElement.image || !enabledElement.element) {
                return;
            }
      
            const { element, image: { imageId } } = enabledElement;
            const { toolState } = cornerstoneTools.globalImageIdSpecificToolStateManager;
            if (!toolState || toolState.hasOwnProperty(imageId) === false) {
                return;
            }

            const imageIdToolState = toolState[imageId];
            const toolsToRemove = [];

            Object.keys(imageIdToolState).forEach(toolType => {
                const { data } = imageIdToolState[toolType];
                data.forEach(tool => {
                    toolsToRemove.push({ toolType, tool });
                });
            });

            if (toolsToRemove.length === 0) {
                return;
            }

            toolsToRemove.forEach(t => {
                cornerstoneTools.removeToolState(element, t.toolType, t.tool);
            });
            cornerstone.updateImage(element);
        }
    };

    function getEnabledElement() {
        return commandsManager.runCommand('getActiveViewportEnabledElement', {}, 'ACTIVE_VIEWPORT::CORNERSTONE');
    }

    function setToolActive(toolName) {
        return {
            commandFn: actions.setToolActive,
            storeContexts: [],
            options: { toolName },
        }
    }

    /** @type {types.Dictionary<types.CommandDefinition>} */
    const definitions = {
        setWwwcTool: setToolActive(toolsMapping.wwwc),
        setPanTool: setToolActive(toolsMapping.pan),
        setAngleTool: setToolActive(toolsMapping.angle),
        setStackScrollTool: setToolActive(toolsMapping.stackScroll),
        setMagnifyTool: setToolActive(toolsMapping.magnify),
        setLengthTool: setToolActive(toolsMapping.length),
        setArrowAnnotateTool: setToolActive(toolsMapping.annotate),
        setDragProbeTool: setToolActive(toolsMapping.dragProbe),
        setEllipticalRoiTool: setToolActive(toolsMapping.ellipticalRoi),
        setRectangleRoiTool: setToolActive(toolsMapping.rectangleRoi),
        setFreehandRoi: setToolActive(toolsMapping.freehandRoi),

        firstImage: {
            commandFn: actions.firstImage,
            options: {},
        },
        lastImage: {
            commandFn: actions.lastImage,
            options: {},
        },
        windowLevelDefault: {
            commandFn: actions.setWindowLevelDefault,
            storeContexts: ['viewports'],
            options: {},
        },
        windowLevelPreset1: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 1 },
        },
        windowLevelPreset2: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 2 },
        },
        windowLevelPreset3: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 3 },
        },
        windowLevelPreset4: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 4 },
        },
        windowLevelPreset5: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 5 },
        },
        windowLevelPreset6: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 6 },
        },
        windowLevelPreset7: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 7 },
        },
        windowLevelPreset8: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 8 },
        },
        windowLevelPreset9: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 9 },
        },
        windowLevelPreset10: {
            commandFn: actions.setWindowLevelPreset,
            storeContexts: ['viewports'],
            options: { preset: 10 },
        },
        setWindowLevel: {
            commandFn: actions.setWindowLevel,
            storeContexts: ['viewports'],
            options: {},
            context: 'ACTIVE_VIEWPORT::CORNERSTONE'
        },
        clearTools: {
            commandFn: actions.clearTools,
            storeContexts: ['viewports'],
            options: {},
        },
    };

    return {
        actions,
        definitions,
        defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE'
    };
}

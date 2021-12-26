/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * August 5, 2021 by Jay Liu
 */

/* eslint-disable prefer-destructuring */
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { keys } from '@onepacs/core';

//@ts-ignore
const { ohif } = window;
const { app: { hotkeysManager } } = ohif;

const {
    addToolState,
    removeToolState,
    EVENTS,
} = cornerstoneTools;

const moveNewHandle = cornerstoneTools.import('manipulators/moveNewHandle');
const triggerEvent = cornerstoneTools.import('util/triggerEvent');
const deepmerge = cornerstoneTools.import('util/deepmerge');

/**
 * This module deals with the customized cornerstone ArrowAnnotateTool
 * Overridden for the following specific features:
 *  - Assign ESC key to cancel tool placement
 * @see https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/tools/annotation/ArrowAnnotateTool.js
 */
 export class ArrowAnnotateTool extends cornerstoneTools.ArrowAnnotateTool {

    constructor(props = {}) {
        super(deepmerge({
            configuration: {
                drawHandles: false,
                drawHandlesOnHover: false,
                hideHandlesIfMoving: true
            }
        }, props));
    }

    addNewMeasurement(evt, interactionType) {
        const element = evt.detail.element;
        const measurementData = this.createNewMeasurement(evt);
    
        if (!measurementData) {
            return;
        }

        const toolName = this.name;
        const config = this.configuration;
    
        // Associate this data with this imageId so we can render it and manipulate it
        addToolState(element, this.name, measurementData);

        // Add a flag for using Esc to cancel tool placement
        let cancelled = false;
        function keydownCallback(e) {
        // If the Esc key was pressed, set the flag to true
            if (e.which === keys.ESC) {
            // Prevent switching to the default tool
                e.stopPropagation();
                cancelled = true;
                cornerstoneTools.removeToolState(element, toolName, measurementData);
                cornerstone.updateImage(element);
            }

            // Don't propagate this keydown event so it can't interfere
            // with anything outside of this tool
            return false;
        }

        // Bind a one-time event listener for the Esc key
        // when the tool is being drawn, we must disable the hotkeys
        // otherwise it will intercept the key before our event handler.
        hotkeysManager.disable();
        document.addEventListener('keydown', keydownCallback);

        cornerstone.updateImage(element);
    
        moveNewHandle(
            evt.detail,
            this.name,
            measurementData,
            measurementData.handles.end,
            this.options,
            interactionType,
            success => {
                // Unbind the ESC keydown hook
                document.removeEventListener('keydown', keydownCallback);
                hotkeysManager.enable();

                if (success && !cancelled) {
                    if (measurementData.text === undefined) {
                        this.configuration.getTextCallback(text => {
                            if (text) {
                                measurementData.text = text;
                            } else {
                                removeToolState(element, this.name, measurementData);
                            }
    
                            measurementData.active = false;
                            cornerstone.updateImage(element);
    
                            triggerEvent(element, EVENTS.MEASUREMENT_MODIFIED, {
                                toolName: this.name,
                                toolType: this.name, // Deprecation notice: toolType will be replaced by toolName
                                element,
                                measurementData,
                            });
                        }, evt.detail);
                    }
                } else {
                    removeToolState(element, this.name, measurementData);
                }
    
                cornerstone.updateImage(element);
    
                const modifiedEventData = {
                    toolName: this.name,
                    toolType: this.name, // Deprecation notice: toolType will be replaced by toolName
                    element,
                    measurementData,
                };
    
                triggerEvent(element, EVENTS.MEASUREMENT_COMPLETED, modifiedEventData);
            }
        );
    }
    
}

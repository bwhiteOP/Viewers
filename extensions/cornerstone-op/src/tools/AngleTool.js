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
 * This module deals with the customized cornerstone AngleTool
 * Override the following specific features:
 *  - Assign ESC key to cancel tool placement
 * @see https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/tools/annotation/AngleTool.js
 */
export class AngleTool extends cornerstoneTools.AngleTool {
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
        if (this.preventNewMeasurement) {
            return;
        }
    
        this.preventNewMeasurement = true;
        evt.preventDefault();
        evt.stopPropagation();
    
        const eventData = evt.detail;
        const measurementData = this.createNewMeasurement(eventData);
        const element = evt.detail.element;

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
    
        // Step 1, create start and second middle.
        moveNewHandle(
            eventData,
            this.name,
            measurementData,
            measurementData.handles.middle,
            this.options,
            interactionType,
            success => {
                measurementData.active = false;
        
                if (!success || cancelled) {
                    removeToolState(element, this.name, measurementData);
                    this.preventNewMeasurement = false;
                    return;
                }
    
                measurementData.handles.end.active = true;
    
                cornerstone.updateImage(element);
    
                // Step 2, create end.
                moveNewHandle(
                    eventData,
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
                            measurementData.active = false;
                            cornerstone.updateImage(element);
                        } else {
                            removeToolState(element, this.name, measurementData);
                        }
        
                        this.preventNewMeasurement = false;
                        cornerstone.updateImage(element);
        
                        const modifiedEventData = {
                            toolName: this.name,
                            toolType: this.name, // Deprecation notice: toolType will be replaced by toolName
                            element,
                            measurementData,
                        };
        
                        triggerEvent(
                            element,
                            EVENTS.MEASUREMENT_COMPLETED,
                            modifiedEventData
                        );
                    }
                );
            }
        )
    }
}

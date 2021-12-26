/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { keys } from '@onepacs/core';
import { applyPerfectModeTransform } from '../../utils/applyPerfectModeTransform';

//@ts-ignore
const { ohif } = window;
const { app: { hotkeysManager } } = ohif;

const {
    addToolState,
    removeToolState,
    EVENTS,
} = cornerstoneTools;

const moveHandle = cornerstoneTools.import('manipulators/moveHandle');
const moveNewHandle = cornerstoneTools.import('manipulators/moveNewHandle');
const triggerEvent = cornerstoneTools.import('util/triggerEvent');

/**
 * This module is called when user apply the first point of an annotation tool.
 * 
 * The method must be applied in the constructor, or else the default cornerstone addNewMeasurement
 * behaviour will be applied instead. The method also assume the use of `this` to mean the
 * annotation instance. Therefore it must be binded.  See example
 * @see https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/eventDispatchers/mouseEventHandlers/addNewMeasurement.js
 * @example
 *  import { addNewMeasurement } from './path/to/this/file';
 *  constructor(props) {
 *    ...
 *    this.addNewMeasurement = addNewMeasurement.bind(this);
 *  }
 * 
 * @param {*} evt 
 * @param {*} interactionType 
 * @returns 
 */
export function addNewMeasurement(evt, interactionType) {
    evt.preventDefault();
    evt.stopPropagation();
    const eventData = evt.detail;
    const {element} = eventData;
    const measurementData = this.createNewMeasurement(eventData);

    if (!measurementData) {
        return;
    }

    const toolName = this.name;
    const config = this.configuration;

    // HV-257 - add perfect mode for ellipse and rectangle
    if (eventData.event.shiftKey) {
        config.activePerfectMode = true;
    }

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

    const handleMover =
      Object.keys(measurementData.handles).length === 1
          ? moveHandle
          : moveNewHandle;

    handleMover(
        eventData,
        this.name,
        measurementData,
        measurementData.handles.end,
        this.options,
        interactionType,
        () => {
            // Unbind the Esc keydown hook
            document.removeEventListener('keydown', keydownCallback);
            hotkeysManager.enable();

            if (cancelled) {
                removeToolState(element, toolName, measurementData);
            } else {

                // HV-257 - Perform one last transformation before the measurementData is committed as completed.
                if (config.activePerfectMode) {
                    config.activePerfectMode = false;
                    applyPerfectModeTransform(measurementData);
                }

                const eventType = EVENTS.MEASUREMENT_COMPLETED;
                const eventData = {
                    toolName: this.name,
                    toolType: this.name, // Deprecation notice: toolType will be replaced by toolName
                    element,
                    measurementData,
                };

                triggerEvent(element, eventType, eventData);
            }

        }
    );
}

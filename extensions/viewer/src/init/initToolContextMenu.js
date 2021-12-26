/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * July 27, 2021 by Jay Liu
 */

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { ToolContextMenu } from '../components';

const CONTEXT_MENU_ID = 'context-menu';

/**
 * This is a customized version of the MeasurementPanel initialization code from the Viewers repo.
 * Viewers\platform\viewer\src\appExtensions\MeasurementsPanel\init.js
 * 
 * @param {types.ModuleFunctionParameters} params
 */
export function initToolContextMenu({ servicesManager, commandsManager }) {
    const { UIDialogService } = servicesManager.services;

    if (!UIDialogService) {
        console.warn('Unable to show dialog; no UI Dialog Service available.');
        return;
    }
    
    cornerstone.events.addEventListener(
        cornerstone.EVENTS.ELEMENT_ENABLED,
        elementEnabledHandler
    );
    cornerstone.events.addEventListener(
        cornerstone.EVENTS.ELEMENT_DISABLED,
        elementDisabledHandler
    );

    function dismissContextMenu() {
        UIDialogService.dismiss({ id: CONTEXT_MENU_ID });
    }

    /** @param {CustomEvent} event */
    function elementEnabledHandler(event) {
        const {element} = event.detail;
        element.addEventListener(cornerstoneTools.EVENTS.TOUCH_PRESS, onTouchPress);
        element.addEventListener(cornerstoneTools.EVENTS.TOUCH_START, dismissContextMenu);
        element.addEventListener(cornerstoneTools.EVENTS.MOUSE_CLICK, handleClick);
    }

    /** @param {CustomEvent} event */
    function elementDisabledHandler(event) {
        const {element} = event.detail;
        element.removeEventListener(cornerstoneTools.EVENTS.TOUCH_PRESS, onTouchPress);
        element.removeEventListener(cornerstoneTools.EVENTS.TOUCH_START, dismissContextMenu);
        element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_CLICK, handleClick);
    }

    /** @param {CustomEvent} event */
    function onTouchPress(event) {
        UIDialogService.create({
            eventData: event.detail,
            content: ToolContextMenu,
            contentProps: { isTouchEvent: true }
        });
    }

    /**
     * Because click gives us the native "mouse up", buttons will always be `0`
     * Need to fallback to event.which;
     * @param {CustomEvent<types.CornerstoneToolsMouseEventData>} event
     */
    function handleClick(event) {
        const mouseUpEvent = event.detail.event;
        const isRightClick = mouseUpEvent.which === 3;

        dismissContextMenu();

        if (!isRightClick)
            return;

        UIDialogService.create({
            id: CONTEXT_MENU_ID,
            isDraggable: false,
            preservePosition: false,
            defaultPosition: getDefaultPosition(event.detail),
            content: ToolContextMenu,
            contentProps: {
                eventData: event.detail,
                onDelete: handleDelete,
                onClose: dismissContextMenu
            },
        });
    }

    /**
     * @param {types.CornerstoneToolsMouseEventData} eventData
     * @param {import('../components').NearbyToolData} nearbyToolData
     */
    function handleDelete(eventData, nearbyToolData) {
        const { element } = eventData;
        commandsManager.runCommand('removeToolState', {
            element,
            toolType: nearbyToolData.toolType,
            tool: nearbyToolData.tool,
        });
    }

    /** @param {types.CornerstoneToolsMouseEventData} eventData */
    function getDefaultPosition(eventData) {
        return {
            x: (eventData && eventData.currentPoints.client.x) || 0,
            y: (eventData && eventData.currentPoints.client.y) || 0,
        };
    }
}

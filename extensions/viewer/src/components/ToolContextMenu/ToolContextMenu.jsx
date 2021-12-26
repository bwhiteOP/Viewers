/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * July 27, 2021 by Jay Liu
 */

/* eslint-disable react/prop-types */

import './ToolContextMenu.styl';

import cornerstone from 'cornerstone-core';
import React from 'react';
import { ContextMenu } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { toolsMapping } from '@onepacs/cornerstone';
import { getApp } from '../../ohif';

/**
 * @typedef {{
 *      tool: any,
 *      index: number,
 *      toolType: string
 * }} NearbyToolData
 * 
 * @typedef {(eventData: types.CornerstoneToolsMouseEventData, nearbyToolData: NearbyToolData) => void} ActionCallback
 */

const toolTypeLabelMap = {
    // Tool list copied from OHIF which may or may not be in use.
    FreehandMouse: 'Freehand ROI',
    CircleRoi: 'Circle ROI',
    Bidirectional: 'Bidirectional',

    // OnePacs customized tools
    [toolsMapping.length]: 'Length',
    [toolsMapping.angle]: 'Angle',
    [toolsMapping.freehandRoi]: 'Freehand ROI',
    [toolsMapping.ellipticalRoi]: 'Elliptical ROI',
    [toolsMapping.rectangleRoi]: 'Rectangle ROI',
    [toolsMapping.annotate]: 'Annotation',
    [toolsMapping.polygonalRoi]: 'Polygonal ROI',
};

const toolsForContextMenu = Object.keys(toolTypeLabelMap);
const toolsWithAnalysis = [
    toolsMapping.ellipticalRoi,
    toolsMapping.rectangleRoi,
    toolsMapping.polygonalRoi,
    toolsMapping.freehandRoi,
];

/**
 * This is a customized version of the ToolContextMenu from the Viewers repo.
 * Viewers\platform\viewer\src\connectedComponents\ToolContextMenu.js
 * @param {{
 *      eventData: any,
 *      onDelete: ActionCallback,
 *      onClose: function,
 *      isTouchEvent: boolean
 * }} params
 */
export function ToolContextMenu({
    eventData,
    onClose,
    onDelete,
    isTouchEvent = false,
}) {

    function getDropdownItems(eventData, isTouchEvent = false) {
        const nearbyToolData = getNearbyToolData(eventData);

        if (!nearbyToolData) {
            return [];
        }

        let dropdownItems = [];

        const { toolType } = nearbyToolData;
        const toolText = nearbyToolData.tool.text || '';
        const toolTypeLabel = toolTypeLabelMap[toolType] || toolType;
    
        if (toolsWithAnalysis.includes(toolType)) {
            dropdownItems.push({
                label: 'Show/Hide Analysis',
                params: { eventData, nearbyToolData },
                action: function({ eventData, nearbyToolData }) {
                    nearbyToolData.tool.showAnalysis = !nearbyToolData.tool.showAnalysis;
                    cornerstone.updateImage(eventData.element);
                    onClose && onClose();
                }
            });
        }

        dropdownItems.push({
            label: `Delete ${toolTypeLabel} ${toolText}`,
            actionType: 'Delete',
            params: { eventData, nearbyToolData },
            action: function({ eventData, nearbyToolData }) {
                onDelete(eventData, nearbyToolData);
            }
        });

        return dropdownItems;
    }
    
    const onClickHandler = ({ action, params }) => {
        action(params);
        onClose && onClose();
    };

    const dropdownItems = getDropdownItems(eventData, isTouchEvent);

    return (
        <div className="ToolContextMenu">
            <ContextMenu items={dropdownItems} onClick={onClickHandler} />
        </div>
    );
}

/**
 * @param {types.CornerstoneToolsMouseEventData} eventData 
 * @returns {NearbyToolData | false | undefined}
 */
function getNearbyToolData(eventData) {
    const { commandsManager } = getApp();
    return commandsManager.runCommand('getNearbyToolData', {
        element: eventData.element,
        canvasCoordinates: eventData.currentPoints.canvas,
        availableToolTypes: toolsForContextMenu,
    });
}

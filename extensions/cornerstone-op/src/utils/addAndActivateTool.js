/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import { getCornerstoneExtensionConfig } from '../tools';
import _ from 'lodash';

const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');

/**
 * Add a tool to cornerstoneTools
 * @param {string} toolName
 * @param {*} tool
 * @param {boolean} enabled
 */
export function addAndActivateTool(toolName, tool, props = {}, enabled = true) {
    if (!toolName || toolName === '') {
        console.error('addAndActivateTool: toolName is not specified');
        return;
    }

    // Adding to cornerstoneTools namespace. This is not the same as adding a tool.
    if (cornerstoneTools[`${toolName}Tool`] === undefined) {
        cornerstoneTools[`${toolName}Tool`] = tool;
    }

    const alreadyAdded = cornerstoneTools.store.state.globalTools[toolName] !== undefined;
    if (alreadyAdded) {
        // We have have customization of existing tool of the same name
        // Use the OnePacs tool instead.
        cornerstoneTools.removeTool(toolName);
    }

    // Actually add the tool
    const cornerstoneExtensionConfig = getCornerstoneExtensionConfig();
    const mergedProps = _.merge({}, cornerstoneExtensionConfig.tools[toolName], props);
    cornerstoneTools.addTool(tool, mergedProps);

    if (enabled) {
        if (tool.prototype instanceof BaseAnnotationTool) {
            cornerstoneTools.setToolPassive(toolName, {});
        } else {
            cornerstoneTools.setToolActive(toolName, {});
        }
    } else {
        cornerstoneTools.setToolDisabled(toolName, {});
    }
}

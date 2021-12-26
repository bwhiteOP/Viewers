/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import _ from 'lodash';

export function updateToolConfiguration(toolName, configuration = {}) {
    // Update global tool cache
    const globalTool = cornerstoneTools.store.state.globalTools[toolName];
    if (globalTool) {
        globalTool.props = _.merge({}, globalTool.props, { configuration });
    }

    // Update instance of tool that is already created.
    const tool = cornerstoneTools.store.state.tools.find(t => t.name === toolName);
    if (tool) {
        tool.configuration = _.merge({}, tool.configuration, configuration);
    }
}

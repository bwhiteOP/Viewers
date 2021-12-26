/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 09, 2020 by Jay Liu
 */

import { log } from '@onepacs/core';

const modules = {};

/**
 * A list of known modules that are exported by @ohif/viewer.
 * This is used instead of a plain string to enforce integration consistency.
 */
export const OHIF_VIEWER_MODULE_TYPE = {
    ConnectedStudyBrowser: 'ConnectedStudyBrowser',
    ConnectedViewerMain: 'ConnectedViewerMain',
    SidePanel: 'SidePanel',
    ErrorBoundaryDialog: 'ErrorBoundaryDialog',
    ConnectedCineDialog: 'ConnectedCineDialog',
    ConnectedLayoutButton: 'ConnectedLayoutButton',
    ToolbarRow: 'ToolbarRow',
};

/**
 * The @ohif/viewer is the main client app. It is not possible to reference it as a package.
 * Yet we need to expose some @ohif/viewer classes so that we can extend its features.
 * The purpose of this is to allow @ohif/viewer to register modules to be used in @onepacs/viewer.
 *
 * @example
 *
 * In @ohif/viewer
 *
 *      ohifViewerModulesProvider.register(OHIF_VIEWER_MODULE_TYPE.CONNECTED_VIEWER, ConnectedViewer);
 *
 * In @onepacs/viewer
 *
 *      const ConnectedViewer = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.CONNECTED_VIEWER);
 *      return (
 *          <ConnectedViewer ... />
 *      );
 *
 */
export const ohifViewerModulesProvider = {

    /**
     * Register a @ohif/viewer javascript module to be used in @onepacs/viewer.
     * @param {string} id
     * @param {*} module
     */
    register: function (id, module) {
        if (!isValid(id)) {
            throw new Error(`Module ${id} is not yet supported. Please add it to 'OHIF_VIEWER_MODULE_TYPE'`);
        }

        log.debug(`Registering OHIF Viewer module: ${id}`);
        modules[id] = module;
    },

    /**
     * Gets the @ohif/viewer module of the specified id.
     * @param {string} id
     */
    get(id) {
        return modules[id];
    }
};

/**
 * @param {*} moduleId
 * @returns {boolean} true if thte id is valid, false otherwise.
 */
function isValid(moduleId) {
    return Object.values(OHIF_VIEWER_MODULE_TYPE).indexOf(moduleId) !== -1
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * July 21, 2020 by Jay Liu
 */

/**
 * Entry point for web/browser envrionment
 */

import './styles/common.styl';

import { getAppConfig } from './config/appConfig';
import configOnePacs from './config/configOnePacs';
import { ohifViewerModulesProvider, OHIF_VIEWER_MODULE_TYPE } from './ohif/ohifViewerModulesProvider';
import '@onepacs/i18n';

if (configOnePacs.useOnePacs) {
    document.title = configOnePacs.windowTitle || 'OnePacs WebViewer 2';
}

export {
    getAppConfig,
    ohifViewerModulesProvider,
    OHIF_VIEWER_MODULE_TYPE
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * July 27, 2020 by Jay Liu
 */

import { getPublicUrl, publicSettings } from '@onepacs/core';
import hotkeys from './configHotkeys';
import servers from './configServers';
import extensions from './configExtensions';
import onePacs from './configOnePacs';
import { getCornerstoneExtensionConfig } from '@onepacs/cornerstone';

/**
 * Configuration file for OnePacsWebViewer viewer
 * @see https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/viewer/public/config/default.js
 * @see https://docs.ohif.org/configuring/#how-do-i-configure-my-project
 */
export function getAppConfig() {
    // Must load our settings before app starts
    return publicSettings.load().then(() => {
        console.log('public url is', getPublicUrl());
        return {
            routerBasename: getPublicUrl(),
            extensions: extensions,
            showStudyList: true,
            filterQueryParam: false,
            servers: servers,
            hotkeys: hotkeys,
            onePacs: onePacs,
            disableMeasurementPanel: true,
            cornerstoneExtensionConfig: getCornerstoneExtensionConfig()
    
            // Following property limits number of simultaneous series metadata requests.
            // For http/1.x-only servers, set this to 5 or less to improve
            //  on first meaningful display in viewer
            // If the server is particularly slow to respond to series metadata
            //  requests as it extracts the metadata from raw files everytime,
            //  try setting this to even lower value
            // Leave it undefined for no limit, sutiable for HTTP/2 enabled servers
            // maxConcurrentMetadataRequests: 5,
        };
    })
}

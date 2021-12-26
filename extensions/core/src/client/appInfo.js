/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 19, 2020 by Jay Liu
 */

import { routes } from '../both/routes';
import { getAsync } from './restUtils';

/**
 * @typedef {import('../types/api').ApplicationInfo} ApplicationInfo
 */

// Call at startup import time to asynchronously update the `appInfo`
updateAppInfo();

/**
 * @type {ApplicationInfo}
 */
export const appInfo = {
    name: '',
    version: '',
    description: '',
    author: '',
};

/**
 * Asynchronously fetch the application information from server package.json file
 */
async function updateAppInfo() {
    /** @type {{ result?: ApplicationInfo, error?: Error }} */
    const { result } = await getAsync(routes.server.api.getAppInfo);

    if (result) {
        appInfo.name = result.name;
        appInfo.version = result.version;
        appInfo.description = result.description;
        appInfo.author = result.author;
    }
}

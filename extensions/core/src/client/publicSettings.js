/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 26, 2020 by PoyangLiu
 */

import _ from 'lodash';
import urljoin from 'url-join';
import { getPublicUrl } from './restUtils';
import settingsPublicJson from './settings.public.json';

/** @type {Promise<typeof settingsCache>} */
let loadPromise = undefined;

let settingsCache = _.merge({}, settingsPublicJson, {
    public: {
        // Copied from WebViewer 1
        OnePacsWADOUrl: '',
        OnePacsViewReportUrl: ''
    }
});


/**
 * The static instance of the public settings.
 */
export const publicSettings = {
    /** @returns {typeof settingsCache.public} */
    cached: function() { return _.cloneDeep(settingsCache.public); },

    load: function() {
        if (!loadPromise) {
            loadPromise = loadRootPublicSettingsFile();
        }
        return loadPromise;
    }
}

/**
 * For the viewer application, the webpack steps copies the settings.public.json to the root
 * of the distribution bundle. We first load the static (template) settings.public.json.
 * We then asynchronously fetch the copy at the root and *overwrite* the original.
 */
function loadRootPublicSettingsFile() {
    // fetch the public settings from the root (if there is one copied there)
    const settingsUrl = urljoin(getPublicUrl(), 'settings.public.json');
    return fetch(settingsUrl)
        .then(result => result.json())
        .then((loadedSettings) => {
            settingsCache = _.merge({}, settingsCache, loadedSettings);
            settingsCache.public.OnePacsWADOUrl = window.location.host + settingsCache.public.OnePacsWADOUrlPath;
            settingsCache.public.OnePacsViewReportUrl = window.location.host + settingsCache.public.OnePacsWADOUrlPath;
            return settingsCache;
        });
}

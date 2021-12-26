/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

import { log, publicSettings, Stopwatch } from '@onepacs/core';
import { WebSocketConnectionPoolInstance } from './classes/WebSocketConnectionPool';

/**
 * Download image via WebSocket
 * @param {string} url - The image URL
 * @param {string} imageId - The image Id
 * @returns {Promise<ArrayBuffer>}
 */
export const webSocketRequest = function (url, imageId) {
    const downloadTimer = new Stopwatch();

    const cachedSettings = publicSettings.cached();
    const trackDownloadTime = cachedSettings.DebugMode?.enabled && cachedSettings.DebugMode.printDownloadTime;

    if (trackDownloadTime) {
        downloadTimer.start();
    }

    // Download the DICOM file via websocket
    return new Promise((resolve, reject) => {
        WebSocketConnectionPoolInstance.send(imageId, url, (dataAsArrayBuffer) => {
            if (trackDownloadTime && downloadTimer.isRunning) {
                const downloadDuration = downloadTimer.stop();
                log.debug(`Download Time: ${downloadDuration} ms for image ${imageId}`);
            }

            if (!dataAsArrayBuffer) {
                // Request failed, so log and reject the promise
                const error = `Failed to retrieve the DICOM file: ${url}`;
                log.error(error);
                reject(error);
                return;
            }

            resolve(dataAsArrayBuffer);
        });
    });
}

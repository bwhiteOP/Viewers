/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, EVENTS } from '@onepacs/core';
import cornerstone from 'cornerstone-core';
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader';

/**
 * This module deals with loading images via HTTP and/or HTTPS
 * Extends cornerstoneWebImageLoader
 * @see https://github.com/cornerstonejs/cornerstoneWebImageLoader/blob/master/src/index.js
 * @param {string} imageId
 * @param {*} options
 * @returns {types.ImageLoadObject}
 */
function loadImage(imageId, options = {}) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', imageId, true);
    xhr.responseType = 'arraybuffer';

    xhr.onprogress = function (oProgress) {
        if (oProgress.lengthComputable) {
            // evt.loaded the bytes browser receive
            // evt.total the total bytes set by the header
            const { loaded, total } = oProgress;
            const percentComplete = Math.round((loaded / total) * 100);

            //  HV-138 Use viewport image id
            const eventData = {
                imageId: options.viewportImageId,
                loaded,
                total,
                percentComplete
            };

            cornerstone.triggerEvent(cornerstone.events, EVENTS.IMAGE_LOAD_PROGRESS, eventData);
        }
    };

    /** @type {Promise<types.Image>} */
    const promise = new Promise((resolve, reject) => {
        xhr.onload = function () {
            // @ts-ignore
            const imagePromise = cornerstoneWebImageLoader.arrayBufferToImage(this.response);

            imagePromise.then((image) => {
                //  HV-138 Use viewport image id to create the image
                // @ts-ignore
                const imageObject = cornerstoneWebImageLoader.createImage(image, options.viewportImageId);

                resolve(imageObject);
            }, reject);
        };

        xhr.onerror = function (error) {
            reject(error);
        };

        xhr.send();
    });

    const cancelFn = () => {
        xhr.abort();
    };

    return {
        promise,
        cancelFn
    };
}

// Inject the current cornerstone version into cornerstone web image loader
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

export default loadImage;

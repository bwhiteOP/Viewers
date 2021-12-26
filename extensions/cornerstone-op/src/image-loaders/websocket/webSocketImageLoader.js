/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, log, publicSettings, Stopwatch } from '@onepacs/core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { webSocketRequest } from './webSocketRequest';

/**
 * @typedef {{ imageDoneCallback?: (image: types.Image) => void}} ImageLoaderCallbacks
 */

/**
 * This is a customized loader for loading images via WebSocket from OnePacs server.
 * The code is largely borrowed from WebViewer 1
 * @see https://github.com/onepackius/OP_WEBV/tree/master/OnePacsWebViewer/packages/onepacs-image-loaders/client/websocketImageLoader
 * @param {string} imageId
 * @param {*} options
 * @returns {types.ImageLoadObject}
 */
function loadImage(imageId, options = {}) {
    /** @type {types.ParsedImageId} */
    const parsedImageId = cornerstoneWADOImageLoader.wadouri.parseImageId(imageId);

    // Use webSocketRequest to download images via websocket
    const loader = webSocketRequest;

    // If the dataset for this url is already loaded, use it
    if (cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.isLoaded(parsedImageId.url)) {
        const dataSet = cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.get(parsedImageId.url);
        if (dataSet) {
            return loadImageFromDataSet(dataSet, imageId, parsedImageId.frame, parsedImageId.url, options);
        }
    }

    // Load the dataSet via the dataSetCacheManager
    const dataSetPromise = cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(parsedImageId.url, loader, options.viewportImageId);
    return loadDataSetFromPromise(dataSetPromise, imageId, parsedImageId.frame, parsedImageId.url, options);
}

/**
 * Load image from pre-existing dataset.
 * @param {types.DataSet} dataSet
 * @param {string} imageId
 * @param {number} frame
 * @param {string} sharedCacheKey
 * @param {*} options
 * @param {ImageLoaderCallbacks} [callbacks]
 * @returns {types.ImageLoadObject}
 */
function loadImageFromDataSet(dataSet, imageId, frame = 0, sharedCacheKey, options, callbacks) {
    const loadTimer = new Stopwatch();
    const promise = getLoadImagePromise(loadTimer, dataSet, imageId, frame, sharedCacheKey, options, callbacks);
    return {
        promise,
        cancelFn: undefined
    };
}

/**
 * Load image from a dataset promise.
 * @param {Promise<types.DataSet>} dataSetPromise
 * @param {string} imageId
 * @param {number} frame
 * @param {string} sharedCacheKey
 * @param {*} options
 * @param {ImageLoaderCallbacks} [callbacks]
 * @returns {types.ImageLoadObject}
 */
function loadDataSetFromPromise(dataSetPromise, imageId, frame = 0, sharedCacheKey, options, callbacks) {
    const loadTimer = new Stopwatch();
    loadTimer.start();
    const promise = dataSetPromise.then((dataSet) => {
        return getLoadImagePromise(loadTimer, dataSet, imageId, frame, sharedCacheKey, options, callbacks);
    });

    const imageLoadObject = {
        promise: promise,
        cancelFn: undefined,
        decache: getDecacheFunction(imageId)
    };

    return imageLoadObject;
}

/**
 * @param {Stopwatch} loadTimer
 * @param {types.DataSet} dataSet
 * @param {string} imageId
 * @param {number} frame
 * @param {string} sharedCacheKey
 * @param {*} options
 * @param {ImageLoaderCallbacks} [callbacks]
 * @returns {Promise<types.Image>}
 */
function getLoadImagePromise(loadTimer, dataSet, imageId, frame = 0, sharedCacheKey, options, callbacks) {
    if (!loadTimer.isRunning) {
        loadTimer.start();
    }

    return new Promise((resolve, reject) => {
        const decompressTimer = new Stopwatch();
        const loadTimeInMS = loadTimer.peek();

        /** @type {Promise<types.Image>} */
        let imagePromise;

        const cachedSettings = publicSettings.cached();
        const trackDecompressTime = cachedSettings.DebugMode?.enabled && cachedSettings.DebugMode.printDecompressTime;

        try {
            const pixelData = getPixelData(dataSet, frame);
            const transferSyntax = dataSet.string('x00020010');

            //  HV-104 Prioritize frames to decompress based on the frame number for multi-frame images (lowest frame number has highest priority)
            if (options && frame) {
                options.priority -= frame;
            }

            if (trackDecompressTime) {
                decompressTimer.start();
            }

            imagePromise = cornerstoneWADOImageLoader.createImage(imageId, pixelData, transferSyntax, options);

        } catch (error) {
            // Reject the promise
            reject(error);

            return;
        }

        imagePromise.then((image) => {
            image.data = dataSet;
            image.sharedCacheKey = sharedCacheKey;

            image.loadTimeInMS = loadTimeInMS;
            image.totalTimeInMS = loadTimer.stop();

            if (trackDecompressTime && decompressTimer.isRunning) {
                const decompressDuration = decompressTimer.stop();
                log.debug(`Decompress Time: ${decompressDuration} ms for image ${imageId}`);
            }

            if (callbacks !== undefined && callbacks.imageDoneCallback !== undefined) {
                callbacks.imageDoneCallback(image);
            }

            resolve(image);

        }, (error) => {
            // Reject the promise
            reject(error);
        });
    });
}

/**
 * Add a decache callback function to clear out our dataSetCacheManager
 * @param {string} imageId
 * @returns {Function}
 */
function getDecacheFunction(imageId) {
    return function () {
        const parsedImageId = cornerstoneWADOImageLoader.wadouri.parseImageId(imageId);
        cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(parsedImageId.url);
    };
}

/**
 * Gets the frame pixel data of from dataset.
 * @param {types.DataSet} dataSet
 * @param {number} frameIndex
 * @returns {import('dicom-parser').ByteStream | Uint8Array}
 */
function getPixelData(dataSet, frameIndex) {
    const pixelDataElement = dataSet.elements.x7fe00010 || dataSet.elements.x7fe00008;

    if (pixelDataElement.encapsulatedPixelData) {
        return cornerstoneWADOImageLoader.wadouri.getEncapsulatedImageFrame(dataSet, frameIndex);
    }
    return cornerstoneWADOImageLoader.wadouri.getUncompressedImageFrame(dataSet, frameIndex);
}

export default loadImage;

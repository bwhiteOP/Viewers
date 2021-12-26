/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 17, 2020 by Jay Liu
 */

/**
 * This module deals with ImageLoaders, loading images and caching images
 * From: https://github.com/cornerstonejs/cornerstone/blob/2.2.8/src/imageLoader.js
 *
 * Override for the following specific features:
 *  - Load and cache the actual dicom images as soon as wado images are retrieved (HV-138)
 *  - Update metadata as soon as dicom images are retrieved before displaying them (HV-180)
 */

import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
// eslint-disable-next-line no-unused-vars
import { types, log, imageUtils, publicSettings } from '@onepacs/core';
import { reduxUser, reduxUserPreferences } from '@onepacs/user';

/** @type {Object.<string, types.ImageLoader>} */
const imageLoaders = {};

/** @type {types.ImageLoader} */
let unknownImageLoader;

/**
 * Load an image using a registered Cornerstone Image Loader.
 * The image loader that is used will be determined by the image loader scheme matching against the imageId.
 *
 * @param {string} imageId A Cornerstone Image Object's imageId
 * @param {Object} [options] Options to be passed to the Image Loader
 * @returns {types.ImageLoadObject} An Object which can be used to act after an image is loaded or loading fails
 * @memberof ImageLoader
 */
function loadImageFromImageLoader(imageId, options) {
    const colonIndex = imageId.indexOf(':');
    const scheme = imageId.substring(0, colonIndex);
    const loader = imageLoaders[scheme];

    if (loader === undefined || loader === null) {
        if (unknownImageLoader !== undefined) {
            return unknownImageLoader(imageId);
        }

        throw new Error('loadImageFromImageLoader: no image loader for imageId');
    }

    return loader(imageId, options);
}


/**
 * Determine whether an image is considered wado based on an imageId.
 * @param {string} imageId
 */
export function isWadoImage(imageId) {
    if (!imageId || imageId === '')
        return false;

    const cachedSettings = publicSettings.cached();
    if (!cachedSettings.OnePacsWADOUrl || cachedSettings.OnePacsWADOUrl === '')
        return false;

    return imageId.indexOf(cachedSettings.OnePacsWADOUrl) >= 0
}

/**
 * Loads an image given an imageId and optional priority and returns a promise which will resolve
 * to the loaded image object or fail if an error occurred.  The loaded image
 * is stored in the cache based on given option
 * @param {string} imageId
 * @param {Object} options
 * @param {boolean} isCache
 */
function performLoadAndCacheImage(imageId, options, isCache) {
    const imageLoadObject = cornerstone.imageCache.getImageLoadObject(imageId);
    if (imageLoadObject !== undefined) {
        return imageLoadObject.promise;
    }

    let promiseResolveFunc;
    let promiseRejectFunc;
    const promise = new Promise((resolve, reject) => {
        promiseResolveFunc = resolve;
        promiseRejectFunc = reject;
    });

    if (!options) {
        options = {};
    }

    //  HV-138 Keep image id as viewport image id to set it as image id for its loaded images after loading
    options.viewportImageId = imageId;

    if (isCache) {
        cornerstone.imageCache.putImageLoadObject(imageId, {
            promise,
            cancelFn: undefined
        });
    }

    //  HV-138 Image Id may be combined with wado and actual image ids, so parse it
    const imageIds = imageUtils.parseImageId(imageId).map(parsedImageId => parsedImageId.imageId);

    const tryToLoadNextImage = (isFirstImageLoaded) => {
        const userPermissions = reduxUser.selectors.getUser().permissions;
        //  HV-194 Skip if disabled in the user permissions
        if (!userPermissions?.allowFullDICOM) {
            //  HV-186 Reject the promise if the first image was not loaded
            if (!isFirstImageLoaded) {
                const error = new Error('Failed to load the image');
                cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOAD_FAILED, { imageId, error });
                promiseRejectFunc(error);
            }

            return;
        }

        //  HV-167 Skip loading dicom image by user preferences, but handle when it is enabled
        const advancePreferences = reduxUserPreferences.selectors.getUserPreferences().advanced;
        if (advancePreferences?.BandwidthSavingModeEnabled) {
            //  HV-186 Reject the promise if the first image was not loaded
            if (!isFirstImageLoaded) {
                const error = new Error('Failed to load the image');
                cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOAD_FAILED, { imageId, error });
                promiseRejectFunc(error);
            }

            return;
        }

        //  HV-138 Load the second image in the parsed image ids if defined
        const secondImageId = imageIds[1];
        if (!secondImageId) {
            //  HV-186 Reject the promise if the first image was not loaded
            if (!isFirstImageLoaded) {
                const error = new Error('Failed to load the image');
                cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOAD_FAILED, { imageId, error });
                promiseRejectFunc(error);
            }

            return;
        }


        const loadNextImage = () => {
            const secondImageLoadObject = loadImageFromImageLoader(secondImageId, options);
            if (secondImageLoadObject === undefined || secondImageLoadObject.promise === undefined) {
                //  HV-186 Reject the promise if the first image was not loaded
                if (!isFirstImageLoaded) {
                    const error = new Error('Failed to load the image');
                    cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOAD_FAILED, { imageId, error });
                    promiseRejectFunc(error);
                }

                log.error('Failed to load actual DICOM image');
                return;
            }

            secondImageLoadObject.promise.then((secondImage) => {
                //  HV-138 Cache the actual dicom image promise only when it is ready for display
                if (isCache) {
                    cornerstone.imageCache.putImageLoadObject(imageId, secondImageLoadObject);
                }

                //  HV-180 Update the metadata if it is DICOM image (not WADO image)
                secondImage.wadoImage = isWadoImage(secondImageId);
                if (!secondImage.wadoImage) {
                    addInstanceMetadata(secondImage).then((instance) => {
                        promiseResolveFunc(secondImage);
                        cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOADED, { imageId, image: secondImage });
                    });
                } else {
                    promiseResolveFunc(secondImage);
                    cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOADED, { imageId, image: secondImage });
                }
            }, (error) => {
                //  HV-186 Reject the promise if the first image was not loaded
                if (!isFirstImageLoaded) {
                    cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOAD_FAILED, { imageId, error });
                    promiseRejectFunc(error);
                }

                log.error('Failed to load actual DICOM image', error);
            });
        };

        loadNextImage();
    };

    //  HV-138 Load the first image in the parsed image ids
    const firstImageId = imageIds[0];

    const firstImageLoadObject = loadImageFromImageLoader(firstImageId, options);
    if (firstImageLoadObject === undefined || firstImageLoadObject.promise === undefined) {
        tryToLoadNextImage(false);
        log.error('Failed to load WADO image');
        return;
    }

    firstImageLoadObject.promise.then((firstImage) => {
        //  HV-180 Update the metadata if it is DICOM image (not WADO image)
        firstImage.wadoImage = isWadoImage(firstImageId);
        if (!firstImage.wadoImage) {
            addInstanceMetadata(firstImage).then((instance) => {
                promiseResolveFunc(firstImage);
                cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOADED, { imageId, image: firstImage });
                tryToLoadNextImage(true);
            });
        } else {
            promiseResolveFunc(firstImage);
            cornerstone.triggerEvent(cornerstone.events, cornerstone.EVENTS.IMAGE_LOADED, { imageId, image: firstImage });
            tryToLoadNextImage(true);
        }

    }, (error) => {
        // Failed to display the first image, however try to load the next image
        tryToLoadNextImage(false);
        log.error('Failed to load WADO image', error);
    });

    return promise;
}

// Loads an image given an imageId and optional priority and returns a promise which will resolve
// to the loaded image object or fail if an error occurred.  The loaded image
// is not stored in the cache

/**
 * Loads an image given an imageId and optional priority and returns a promise which will resolve to
 * the loaded image object or fail if an error occurred.  The loaded image is not stored in the cache
 * based on given option
 *
 * @param {string} imageId A Cornerstone Image Object's imageId
 * @param {Object} [options] Options to be passed to the Image Loader
 * @returns {Promise<types.Image>}
 * @memberof ImageLoader
 */
export function loadImage(imageId, options) {
    if (imageId === undefined) {
        throw new Error('loadImage: parameter imageId must not be undefined');
    }

    return performLoadAndCacheImage(imageId, options, false);
}

// Loads an image given an imageId and optional priority and returns a promise which will resolve
// to the loaded image object or fail if an error occurred.  The image is
// stored in the cache

/**
 * Loads an image given an imageId and optional priority and returns a promise which will resolve to
 * the loaded image object or fail if an error occurred. The image is stored in the cache.
 * @param {string} imageId A Cornerstone Image Object's imageId
 * @param {Object} [options] Options to be passed to the Image Loader
 * @returns {Promise<types.Image>}
 * @memberof ImageLoader
 */
export function loadAndCacheImage(imageId, options) {
    if (imageId === undefined) {
        throw new Error('loadAndCacheImage: parameter imageId must not be undefined');
    }

    return performLoadAndCacheImage(imageId, options, true);
}

/**
 * Registers an imageLoader plugin with cornerstone for the specified scheme
 *
 * @param {string} scheme The scheme to use for this image loader (e.g. 'dicomweb', 'wadouri', 'http')
 * @param {types.ImageLoader} imageLoader A Cornerstone Image Loader function
 * @returns {void}
 * @memberof ImageLoader
 */
export function registerImageLoader(scheme, imageLoader) {
    imageLoaders[scheme] = imageLoader;
}

/**
 * Registers a new unknownImageLoader and returns the previous one (if it exists)
 *
 * @param {types.ImageLoader} imageLoader A Cornerstone Image Loader
 * @returns {types.ImageLoader | undefined} The previous Unknown Image Loader
 * @memberof ImageLoader
 */
export function registerUnknownImageLoader(imageLoader) {
    const oldImageLoader = unknownImageLoader;
    unknownImageLoader = imageLoader;
    return oldImageLoader;
}

/**
 * Updates the metadata for missing fields given a specified image
 * @param {types.Image} image
 * @returns {Promise<any>} A promise of the instance metadata
 */
async function addInstanceMetadata(image) {
    const { metadataProvider } = OHIF.cornerstone;
    return await metadataProvider.addInstance(image.data?.byteArray?.buffer);
}

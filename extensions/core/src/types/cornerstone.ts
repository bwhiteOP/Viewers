/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 15, 2020 by Jay Liu
 */

export type DataSet = import('dicom-parser').DataSet;

export type ImageLoader = Function;

export interface EnabledElement {
    element: HTMLElement,
    canvas: Object,
    image?: Object, // Will be set once image is loaded
    invalid: boolean; // True if image needs to be drawn, false if not
    needsRedraw: boolean;
    options: Object;
    layers: any[];
    data: Object;
    renderingTools: Object;
    uuid: string;
}

export interface Image {
    id: string;
    data: DataSet;
    sharedCacheKey: string;
    loadTimeInMS: number;
    totalTimeInMS: number;
    wadoImage?: boolean; // added by imageLoader
}

export interface ImageLoadObject {
    cancelFn: Function;
    promise?: Promise<Image>;
    decache?: Function;
}

export interface ParsedImageId {
    scheme: string; // 'dicomweb' | 'wadouri' | 'http'
    url: string;
    frame: number;
    imageId?: string // added by imageUtils
}

export interface CacheInformation {
    /** The maximum size of the cache in bytes */
    maximumSizeInBytes: number;
    /** Currently occupied space in the cache in bytes */
    cacheSizeInBytes: number;
    /** Number of ImageLoaders in the cache */
    numberOfImagesCached: number;
}

export interface cornerstone {
    imageCache: {
        imageCache: { [key: string]: Image };
        cachedImages: Image[];
        setMaximumSizeBytes: (numBytes: number) => void;
        putImageLoadObject: (imageId: string, imageLoadObject: ImageLoadObject) => void;
        getImageLoadObject: (imageId: string) => ImageLoadObject;
        removeImageLoadObject: (imageId: string) => void;
        getCacheInfo: () => CacheInformation;
        purgeCache: () => void;
        changeImageIdCacheSize: (imageId: string, newCacheSize: number) => void;
    },
    EVENTS: {
        NEW_IMAGE: string;
        INVALIDATED: string;
        PRE_RENDER: string;
        IMAGE_CACHE_MAXIMUM_SIZE_CHANGED: string;
        IMAGE_CACHE_PROMISE_REMOVED: string;
        IMAGE_CACHE_FULL: string;
        IMAGE_CACHE_CHANGED: string;
        WEBGL_TEXTURE_REMOVED: string;
        WEBGL_TEXTURE_CACHE_FULL: string;
        IMAGE_LOADED: string;
        IMAGE_LOAD_FAILED: string;
        ELEMENT_RESIZED: string;
        IMAGE_RENDERED: string;
        LAYER_ADDED: string;
        LAYER_REMOVED: string;
        ACTIVE_LAYER_CHANGED: string;
        ELEMENT_DISABLED: string;
        ELEMENT_ENABLED: string;
    };
    events: EventTarget;
    triggerEvent: (events: EventTarget, type: string, detail?: any) => void;
    registerImageLoader: (scheme: string, imageLoader: ImageLoader) => void;
}

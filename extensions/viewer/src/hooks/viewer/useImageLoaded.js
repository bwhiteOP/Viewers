/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 8, 2021 by Jay Liu
 */

import { useEffect, useState } from 'react';
import cornerstone from 'cornerstone-core';
import { useCornerstoneEvent } from './useCornerstoneEvent';

/**
 * A custom hook that returns the latest image when it is loaded.
 * This is useful for OnePacs custom image-loader, where it starts with
 * the WADO image and ended with a DICOM image, both sharing the same imageId.
 * @param {*} imageId 
 * @returns 
 */
export function useImageLoaded(imageId) {
    const [image, setImage] = useState();
    const event = useCornerstoneEvent({
        eventName: cornerstone.EVENTS.IMAGE_LOADED,
        eventFilter: e => e.detail.imageId === imageId,
        eventCompleted: e => e.detail.image !== undefined
    });

    useEffect(() => {
        if (imageId === undefined)
            return;
            
        const cachedImage = cornerstone.imageCache.imageCache[imageId];
        if (cachedImage && cachedImage.image) {
            setImage(cachedImage.image);
            return;
        }

        const imageLoadObject = cornerstone.imageCache.getImageLoadObject(imageId);
        if (imageLoadObject !== undefined) {
            imageLoadObject.promise.then(result => {
                setImage(result);
            });
        }
    }, [imageId])

    useEffect(() => {
        if (event) {
            setImage(event.detail.image);
        }
    }, [event])

    return image;
}

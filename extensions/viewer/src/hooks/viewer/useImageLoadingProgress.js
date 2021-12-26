/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 8, 2021 by Jay Liu
 */

import { useEffect, useState } from 'react';
import cornerstone from 'cornerstone-core';
import { EVENTS } from '@onepacs/core';
import { useCornerstoneEvent } from './useCornerstoneEvent';

/**
 * A custom hook that returns the image loading progress of a specific imageId.
 * @param {*} imageId 
 * @returns 
 */
export function useImageLoadingProgress(imageId) {
    const [percentComplete, setPercentComplete] = useState(0);
    const event = useCornerstoneEvent({
        eventName: EVENTS.IMAGE_LOAD_PROGRESS,
        eventFilter: e => e.detail.imageId === imageId,
        eventCompleted: e => e.detail.percentComplete === 100
    });

    useEffect(() => {
        const imageLoadObject = cornerstone.imageCache.getImageLoadObject(imageId);
        if (imageLoadObject !== undefined) {
            imageLoadObject.promise.then(image => {
                if (!image.wadoImage) {
                    setPercentComplete(100);
                }
            });
        }
    }, [imageId])


    useEffect(() => {
        if (event) {
            setPercentComplete(event.detail.percentComplete);
        }
    }, [event])

    return percentComplete;
}

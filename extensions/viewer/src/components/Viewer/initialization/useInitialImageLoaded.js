/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';

export function useInitialImageLoaded() {
    const [isLoaded, setIsLoded] = useState(false);

    // Listen to imageLoaded event only once.
    useEffect(() => {
        function onImageLoaded() {
            if (!isLoaded) {
                setIsLoded(true);

                // Schedule the event to be removed with a slight delay to avoid exception
                setTimeout(() => {
                    cornerstone.events.removeEventListener(cornerstone.EVENTS.IMAGE_LOADED, onImageLoaded);
                });
            }
        }

        cornerstone.events.addEventListener(cornerstone.EVENTS.IMAGE_LOADED, onImageLoaded);
    }, [])

    return isLoaded;
}

/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 8, 2021 by Jay Liu
 */

import { useEffect, useState } from 'react';
import { EVENTS } from '@onepacs/core';
import { useCornerstoneEvent } from './useCornerstoneEvent';

/**
 * A custom hook that resturns the decompression status associated with a specific imageId.
 * @param {*} imageId 
 * @returns 
 */
export function useImageDecompressStatus(imageId) {
    const [status, setStatus] = useState();
    const event = useCornerstoneEvent({
        eventName: EVENTS.DECOMPRESS_PROGRESS,
        eventFilter: e => e.detail.imageId === imageId,
        eventCompleted: e => ['end', 'failed'].includes(e.detail.status)
    });

    useEffect(() => {
        if (event) {
            setStatus(event.detail.status);
        }
    }, [event])

    return status;
}

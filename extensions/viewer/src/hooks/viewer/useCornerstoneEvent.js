/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 01, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';

const AlwaysTrue = _ => true;
const AlwaysFalse = _ => false;

/**
 * A custom hook for subscribing to a specific event based on the event name and filter.
 * @param {{
 *  eventName: string,
 *  eventFilter?: (event: any) => boolean,
 *  eventCompleted?: (event: any) => boolean
 * }} params
 * @returns The event correspond to the parameters.
 */
export function useCornerstoneEvent({
    eventName,
    eventFilter = AlwaysTrue,
    eventCompleted = AlwaysFalse
}) {
    const [event, setEvent] = useState();

    useEffect(() => {
        function eventHandler(e) {
            if (eventFilter(e)) {
                setEvent(e);

                if (eventCompleted(e)) {
                    cornerstone.events.removeEventListener(eventName, eventHandler);
                }
            }
        }
    
        cornerstone.events.addEventListener(eventName, eventHandler);

        return function() {
            cornerstone.events.removeEventListener(eventName, eventHandler);
        }
    },
    [eventName, eventFilter, eventCompleted]);

    return event;
}

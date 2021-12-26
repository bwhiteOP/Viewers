/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useEffect, useRef } from 'react';

/**
 * A custom hook that execute the callback on a regular interval.
 * Set the interval delay to 0/null/undefined to stop the callback.
 * @see https://usehooks-typescript.com/react-hook/use-interval
 * @example
 *  useInterval(() => {
 *      // Your custom logic here
 *      setCount(count + 1);
 *  }, delay);
 *
 * @param {Function} callback
 * @param {number} [delay]
 */
export function useInterval(callback, delay) {
    /** @type {React.MutableRefObject<Function>} */
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

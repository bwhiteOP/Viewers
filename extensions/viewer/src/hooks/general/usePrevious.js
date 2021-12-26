/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 31, 2021 by Jay Liu
 */

import { useEffect, useRef } from 'react';

/**
 * A custom hook that returns the previous value.
 * @see https://usehooks.com/usePrevious/
 * @param {*} value 
 * @param {*} initialValue 
 * @returns {*}
 */
export function usePrevious(value, initialValue) {
    const ref = useRef(initialValue);

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

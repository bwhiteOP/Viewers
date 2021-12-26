/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import _ from 'lodash';

/**
 * A custom hook that returns the windows width and height when the dimensions change.
 * @see https://usehooks-typescript.com/react-hook/use-window-size
 * @returns {{ width?: number, height?: number}} the window size
 */
export function useWindowSize() {
    const [size, setSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = _.debounce(function() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        });

        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);

    }, []); // Empty array ensures that effect is only run on mount

    return size;
}

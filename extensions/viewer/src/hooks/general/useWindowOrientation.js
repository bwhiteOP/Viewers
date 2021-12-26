/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import _ from 'lodash';

/**
 * A custom hook that returns the windows orientation when it changes.
 * Inspired by the useWindowSize hook.
 * @returns {string | number} the window orientation
 */
export function useWindowOrientation() {
    const [orientation, setOrientation] = useState(window.orientation);

    useEffect(() => {
        const handleReorientation = _.debounce(function() {
            setOrientation(window.orientation);
        });

        window.addEventListener('orientationchange', handleReorientation);

        // Call handler right away so state gets updated with initial window orientation
        handleReorientation();

        // Remove event listener on cleanup
        return () => window.removeEventListener('orientationchange', handleReorientation);

    }, []); // Empty array ensures that effect is only run on mount

    return orientation;
}

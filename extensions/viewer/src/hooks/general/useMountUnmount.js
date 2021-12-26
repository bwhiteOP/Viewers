/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useEffect } from 'react';

/**
 * One-time initialization on component mount or un-mount.
 */
export function useMountUnmount(mountCallback, unmountCallback) {
    useEffect(() => {
        mountCallback && mountCallback();

        return function cleanup () {
            // This is a one-time cleanup for this component.
            // Essentially it is the same as componentWillUnmount
            unmountCallback && unmountCallback();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [] /* No deps, run one time */);
}

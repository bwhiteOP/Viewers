/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 8, 2021 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useEffect, useState } from 'react';
import cornerstone from 'cornerstone-core';
import { useInterval } from '../general/useInterval';
import { getStackData } from '../../utils/getStackData';

/**
 * A custom React hook that returns the instance metadata of the imageId when it's ready.
 * @param {string} imageId 
 * @returns {*} instance metadata
 */
export function useStackLoaded(imageId) {
    /** @type {types.useState<import('../../utils/getStackData').StackData>} */
    const [stack, setStack] = useState();
    const [isReady, setIsReady] = useState(false);
    const [interval, setInterval] = useState(0);

    // Update active stack only if imageId changes
    useEffect(() => {
        const activeStack = getStackData();
        setStack(activeStack);
        setInterval(100);
    }, [imageId]);

    useInterval(async () => {
        if (isStackReady(stack)) {
            setIsReady(true);
            setInterval(0); // stop the interval
        }
    }, interval);

    return isReady ? stack : undefined;
}

// Determines if all the instances in this stack have been received
function isStackReady(stack) {
    const imageWithoutMetadata = stack.imageIds.find(id => cornerstone.metaData.get('instance', id) === undefined);
    return imageWithoutMetadata === undefined;
}

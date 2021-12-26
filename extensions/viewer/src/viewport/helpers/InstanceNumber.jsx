/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 31, 2021 by Jay Liu
 */

/* eslint-disable react/prop-types */

import React from 'react';
import cornerstone from 'cornerstone-core';
import { useStackLoaded } from '../../hooks/viewer';

// HV-122 and HV-463 - Smarter instance number indicator text
export function InstanceNumber({ imageId, imageIndex, instanceNumber }) {
    const stack = useStackLoaded(imageId);

    if (!stack || stack.imageIds.length <= 1) {
        return <div className="instanceNumber"></div>;
    }

    const stackSize = stack.imageIds.length;
    const areInstanceNumbersConsecutive = checkInstanceNumbersConsecutive(stack.imageIds);
    if (areInstanceNumbersConsecutive === undefined) {
        // Not all the instances in this stack have metadata yet. Fallback to the default value
        return <div className="instanceNumber">Img: {imageIndex}/{stackSize}</div>;
    }
    
    if (areInstanceNumbersConsecutive === true) {
        return <div className="instanceNumber">Img: {imageIndex}/{stackSize}</div>;
    }
    
    return (
        <div className="instanceNumber">
            <span>Img: {instanceNumber} ({imageIndex}/{stackSize} received)</span>
            <br />
            <span>Series may be incomplete</span>
        </div>
    )
}

/**
 * Check the images to see if the instance numbers are consecutive.
 * @returns {boolean | undefined} True or false if the instance number is consecutive. Undefined if there is not enough information.
 */
function checkInstanceNumbersConsecutive(imageIds) {
    if (imageIds.length === 0) {
        return;
    }

    const imageWithoutMetadata = imageIds.find(id => cornerstone.metaData.get('instance', id) === undefined);
    if (imageWithoutMetadata !== undefined) {
        // Not all the instances in this stack have metadata yet. Fallback to the default value
        return;
    }

    let previousInstanceNumber;
    for (let i = 0; i < imageIds.length; i++) {
        let currentInstance = cornerstone.metaData.get('instance', imageIds[i]);
        let currentInstanceNumber = currentInstance.InstanceNumber && parseInt(currentInstance.InstanceNumber, 10);

        if (i == 0 && currentInstanceNumber !== 0 && currentInstanceNumber !== 1) {
            return false; // Invalid startup instance number
        }
    
        if (previousInstanceNumber && (currentInstanceNumber - previousInstanceNumber) > 1) {
            return false; // non-consecutive
        }

        previousInstanceNumber = currentInstanceNumber;
    }

    return true
}

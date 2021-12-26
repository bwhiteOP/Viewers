/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

export function deserializeSpatialTransformationModule(dataSet) {
    if (!dataSet || !dataSet.elements) {
        return;
    }

    const imageHorizontalFlip = dataSet.string('x00700041');
    const imageRotation = dataSet.uint16('x00700042');

    return {
        imageHorizontalFlip,
        imageRotation
    };
}

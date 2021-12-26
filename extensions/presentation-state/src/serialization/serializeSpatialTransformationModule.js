/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

const spatialTransformRotationTranslation = [0, 90, 180, 270, 0, 270, 180, 90, 180, 90, 0, 270, 180, 270, 0, 90];

export function serializeSpatialTransformationModule(viewport) {
    const rotationBy90 = (((viewport.rotation % 360) + 360) % 360) / 90;
    const flipState = (viewport.vflip ? 2 : 0) + (viewport.hflip ? 1 : 0);

    const imageRotation = spatialTransformRotationTranslation[rotationBy90 + (4 * flipState)];
    const imageHorizontalFlip = (viewport.hflip ^ viewport.vflip) ? 'Y' : 'N';

    return {
        ImageHorizontalFlip: imageHorizontalFlip,
        ImageRotation: imageRotation
    };
}

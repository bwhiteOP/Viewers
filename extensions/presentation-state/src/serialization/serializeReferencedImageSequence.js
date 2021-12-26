/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

export function serializeReferencedImageSequence(instance) {
    return [{
        ReferencedSOPClassUID: instance.SOPClassUID,
        ReferencedSOPInstanceUID: instance.SOPInstanceUID,
        ReferencedFrameNumber: instance.frameNumber || 1
    }];
}

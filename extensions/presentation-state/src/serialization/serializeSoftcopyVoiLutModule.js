/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import { serializeReferencedImageSequence } from './serializeReferencedImageSequence';

export function serializeSoftcopyVoiLutModule(instance, viewport) {
    return [{
        ReferencedImageSequence: serializeReferencedImageSequence(instance),
        WindowCenter: viewport.voi?.windowCenter,
        WindowWidth: viewport.voi?.windowWidth,
        WindowCenterWidthExplanation: 'USER',
        VOILUTFunction: 'LINEAR'
    }];
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import { serializeReferencedImageSequence } from './serializeReferencedImageSequence';

export function serializeRelationshipModule(instance) {

    return [{
        SeriesInstanceUID: instance.SeriesInstanceUID,
        ReferencedImageSequence: serializeReferencedImageSequence(instance)
    }];
}

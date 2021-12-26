/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import DicomSoftcopyPresentationStateBase from './DicomSoftcopyPresentationStateBase';

export class DicomGrayscaleSoftcopyPresentationState extends DicomSoftcopyPresentationStateBase {
    constructor(dataSet) {
        super(dataSet);

        super.deserializeRelationshipModule(dataSet);
        super.deserializeSpatialTransformationModule(dataSet);
        super.deserializeDisplayedAreaModule(dataSet);
        super.deserializeGraphicAnnotationModule(dataSet);
        super.deserializeSoftcopyVoiLutModule(dataSet);
    }
}

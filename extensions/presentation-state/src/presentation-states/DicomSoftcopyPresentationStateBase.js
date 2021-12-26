/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import {
    deserializeRelationshipModule,
    deserializeSpatialTransformationModule,
    deserializeDisplayedAreaModule,
    deserializeSoftcopyVoiLutModule,
    deserializeGraphicAnnotationModule
} from '../serialization';

export default class {
    constructor(dataSet) {
        this.creationDateTime = null;

        if (!dataSet || !dataSet.elements) {
            return;
        }

        // DICOM tags: presentationCreationDate + presentationCreationTime
        this.creationDateTime = `${dataSet.string('x00700082')}${dataSet.string('x00700083')}`;

        if (!this.creationDateTime) {
            // DICOM tags: series date + series time
            this.creationDateTime = `${dataSet.string('x00080021')}${dataSet.string('x00080031')}`;
        }
    }

    getCreationDateTime() {
        return this.creationDateTime;
    }

    deserializeRelationshipModule(dataSet) {
        this.relationshipModule = deserializeRelationshipModule(dataSet);
    }

    deserializeSpatialTransformationModule(dataSet) {
        this.spatialTransformationModule = deserializeSpatialTransformationModule(dataSet);
    }

    deserializeDisplayedAreaModule(dataSet) {
        this.displayedAreaModule = deserializeDisplayedAreaModule(dataSet);
    }

    deserializeGraphicAnnotationModule(dataSet) {
        this.graphicAnnotationModule = deserializeGraphicAnnotationModule(dataSet);
    }

    deserializeSoftcopyVoiLutModule(dataSet) {
        this.softcopyVoiLutModule = deserializeSoftcopyVoiLutModule(dataSet);
    }

    getRelationshipModule() {
        return this.relationshipModule;
    }

    getSpatialTransformationModule() {
        return this.spatialTransformationModule;
    }

    getDisplayedAreaModule() {
        return this.displayedAreaModule;
    }

    getGraphicAnnotationModule() {
        return this.graphicAnnotationModule;
    }

    getSoftcopyVoiLutModule() {
        return this.softcopyVoiLutModule;
    }
}

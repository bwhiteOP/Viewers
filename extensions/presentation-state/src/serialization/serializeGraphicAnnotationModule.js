/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '@onepacs/cornerstone';
import { 
    graphicLayer,
    serializeAngle,
    serializeArrowAnnotate,
    serializeEllipticalRoi,
    serializeLength,
    serializePolygonalRoi,
    serializeRectangleRoi,
    serializeTextMarker,
} from './graphicAnnotation';

const supportedRoiTypes = [
    toolsMapping.textMarker,
    toolsMapping.length,
    toolsMapping.ellipticalRoi,
    toolsMapping.rectangleRoi,
    toolsMapping.polygonalRoi,
    toolsMapping.freehandRoi,
    toolsMapping.annotate,
    toolsMapping.angle
];

export function serializeGraphicAnnotationModule(enabledElement, instance) {
    const { element, image } = enabledElement;
    if (!element || !image) {
        return;
    }

    const graphicAnnotationSequence = [];

    //  Serialize all supported ROIs
    supportedRoiTypes.forEach((supportedRoiType) => {
        const toolData = cornerstoneTools.getToolState(element, supportedRoiType);
        if (!toolData || !toolData.data || !toolData.data.length) {
            return;
        }

        toolData.data.forEach((roiData) => {
            switch (supportedRoiType) {
                case toolsMapping.length:
                    graphicAnnotationSequence.push(serializeLength(roiData, instance));
                    break;
                case toolsMapping.ellipticalRoi:
                    graphicAnnotationSequence.push(serializeEllipticalRoi(roiData, instance));
                    break;
                case toolsMapping.rectangleRoi:
                    graphicAnnotationSequence.push(serializeRectangleRoi(roiData, instance));
                    break;
                case toolsMapping.polygonalRoi:
                case toolsMapping.freehandRoi:
                    graphicAnnotationSequence.push(serializePolygonalRoi(roiData, instance));
                    break;
                case toolsMapping.annotate:
                    graphicAnnotationSequence.push(serializeArrowAnnotate(roiData, instance));
                    break;
                case toolsMapping.textMarker:
                    graphicAnnotationSequence.push(serializeTextMarker(roiData, instance));
                    break;
                case toolsMapping.angle:
                    graphicAnnotationSequence.push(serializeAngle(roiData, instance));
                    break;
                default:
                    console.warn(`Serializer not found for ROI type: ${supportedRoiType}`);
            }
        });
    });

    const graphicAnnotationModule = {
        GraphicLayerSequence: [{
            GraphicLayer: graphicLayer,
            GraphicLayerOrder: 1
        }],
        GraphicAnnotationSequence: graphicAnnotationSequence.filter(item => item)
    };
    return graphicAnnotationModule;
}

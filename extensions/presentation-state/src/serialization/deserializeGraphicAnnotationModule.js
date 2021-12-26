/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import deserializeReferencedImageSequence from './deserializeReferencedImageSequence';

//------------------------------------------------------------------------------
function parseGraphicData(dataSet, numberOfGraphicPoints) {
    const points = [];

    if (!numberOfGraphicPoints) {
        return;
    }

    for (let i = 0; i < numberOfGraphicPoints * 2; i += 2) {
        points.push({
            // x00700022 Graphic Data Attrbiute
            x: parseFloat(dataSet.float('x00700022', i).toFixed(2)),
            y: parseFloat(dataSet.float('x00700022', i + 1).toFixed(2))
        });
    }

    return points;
}

//------------------------------------------------------------------------------
function deserializeGraphicObjectSequenceItem(dataSet) {
    const graphicAnnotationUnits = dataSet.string('x00700005');
    const graphicDimensions = dataSet.uint16('x00700020');
    const numberOfGraphicPoints = dataSet.uint16('x00700021');
    const graphicData = parseGraphicData(dataSet, numberOfGraphicPoints);
    const graphicType = dataSet.string('x00700023');
    const graphicFilled = dataSet.string('x00700024');

    return {
        graphicAnnotationUnits,
        graphicDimensions,
        numberOfGraphicPoints,
        graphicData,
        graphicType,
        graphicFilled
    };
}

//------------------------------------------------------------------------------
function deserializeTextObjectSequenceItem(dataSet) {
    const boundingBoxAnnotationUnits = dataSet.string('x00700003');
    const anchorPointAnnotationUnits = dataSet.string('x00700004');
    const unformattedTextValue = dataSet.string('x00700006');
    const boundingBoxTopLeftHandCorner = {
        x: dataSet.float('x00700010', 0),
        y: dataSet.float('x00700010', 1)
    };
    const boundingBoxBottomRightHandCorner = {
        x: dataSet.float('x00700011', 0),
        y: dataSet.float('x00700011', 1)
    };
    const boundingBoxTextHorizontalJustification = dataSet.string('x00700012');
    const anchorPoint = {
        x: dataSet.float('x00700014', 0),
        y: dataSet.float('x00700014', 1)
    };
    const anchorPointVisibility = dataSet.string('x00700015');

    return {
        boundingBoxAnnotationUnits,
        anchorPointAnnotationUnits,
        unformattedTextValue,
        boundingBoxTopLeftHandCorner,
        boundingBoxBottomRightHandCorner,
        boundingBoxTextHorizontalJustification,
        anchorPoint,
        anchorPointVisibility
    };
}

//------------------------------------------------------------------------------
function deserializeGraphicAnnotationSequenceItem(dataSet) {
    const graphicObjects = [];
    const textObjects = [];

    if (!dataSet || !dataSet.elements) {
        return;
    }

    const textObjectSequence = dataSet.elements.x00700008;
    const graphicObjectSequence = dataSet.elements.x00700009;
    if (graphicObjectSequence && graphicObjectSequence.items && graphicObjectSequence.items.length > 0) {
        // Deserialize Graphic Object Sequence
        for (let i = 0; i < graphicObjectSequence.items.length; i++) {
            const graphicObjectSequenceItemDataSet = graphicObjectSequence.items[0].dataSet;
            if (!graphicObjectSequenceItemDataSet || !graphicObjectSequenceItemDataSet.elements) {
                return;
            }

            const graphicObject = deserializeGraphicObjectSequenceItem(graphicObjectSequenceItemDataSet);

            if (textObjectSequence && textObjectSequence.items && textObjectSequence.items.length > i && textObjectSequence.items[i]) {
                // Deserialize Text Object Sequence for Graphic Object Sequence Item
                const textObjectSequenceDataSet = textObjectSequence.items[i].dataSet;
                if (!textObjectSequenceDataSet || !textObjectSequenceDataSet.elements) {
                    return;
                }

                graphicObject.textObject = deserializeTextObjectSequenceItem(textObjectSequenceDataSet);
            }

            graphicObjects.push(graphicObject);
        }
    } else if (textObjectSequence && textObjectSequence.items && textObjectSequence.items.length > 0) {
        // Deserialize Text Object Sequence
        textObjectSequence.items.forEach((textObjectSequenceItem) => {
            const textObjectSequenceDataSet = textObjectSequenceItem.dataSet;
            if (!textObjectSequenceDataSet || !textObjectSequenceDataSet.elements) {
                return;
            }

            const textObject = deserializeTextObjectSequenceItem(textObjectSequenceDataSet);

            textObjects.push(textObject);
        });
    }

    return {
        graphicObjects,
        textObjects
    };
}

//------------------------------------------------------------------------------
export function deserializeGraphicAnnotationModule(dataSet) {
    if (!dataSet || !dataSet.elements) {
        return;
    }

    const graphicAnnotationSequence = dataSet.elements.x00700001;
    if (!graphicAnnotationSequence || !graphicAnnotationSequence.items || graphicAnnotationSequence.items.length < 1) {
        return;
    }

    const graphicAnnotations = [];

    graphicAnnotationSequence.items.forEach((graphicAnnotationSequenceItem) => {
        const graphicAnnotationSequenceItemDataSet = graphicAnnotationSequenceItem.dataSet;
        if (!graphicAnnotationSequenceItemDataSet || !graphicAnnotationSequenceItemDataSet.elements) {
            return;
        }

        const graphicLayer = graphicAnnotationSequenceItemDataSet.string('x00700002');

        const referencedImages = deserializeReferencedImageSequence(graphicAnnotationSequenceItemDataSet);

        const graphicAnnotation = deserializeGraphicAnnotationSequenceItem(graphicAnnotationSequenceItemDataSet);

        graphicAnnotations.push({
            referencedImages,
            graphicLayer,
            ...graphicAnnotation
        });
    });

    return {
        graphicAnnotations
    };
}

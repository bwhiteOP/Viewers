/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import { drawGraphicAnnotation } from '../drawing/drawGraphicAnnotation';

/**
 * Show image-specific DICOM Softcopy Presentation State modules on a cornerstone element
 * @param enabledElement Cornerstone element where the image-specific presentation state modules are shown
 * @param presentationState DICOM Softcopy Presentation State to be shown
 */
export function showPresentationState(enabledElement, presentationState) {
    if (!enabledElement || !presentationState) {
        return;
    }

    const { viewport, canvas, image } = enabledElement;
    if (!viewport || !canvas || !image) {
        return;
    }

    //  Skip if it is WADO image
    if (image.wadoImage) {
        return;
    }

    const instance = OHIF.cornerstone.metadataProvider.getInstance(image.imageId);
    if (!instance) {
        return;
    }

    //  Apply viewport-specific presentation state modules only once
    if (!viewport.presentationStateApplied) {
        applySpatialTransformationModule(viewport, presentationState);
        applyDisplayedAreaModule(viewport, canvas, image, instance.SOPInstanceUID, presentationState);
        applySoftcopyVoiLutModule(viewport, instance.SOPInstanceUID, presentationState);

        viewport.presentationStateApplied = true;
    }

    //  Apply image-specific presentation state modules
    applyGraphicAnnotationModule(enabledElement.element, instance.SOPInstanceUID, presentationState);

    //  Update the image
    cornerstone.updateImage(enabledElement.element);
}

//------------------------------------------------------------------------------
function applySpatialTransformationModule(viewport, presentationState) {
    const spatialTransformationModule = presentationState.getSpatialTransformationModule();
    if (!spatialTransformationModule) {
        return;
    }

    if (spatialTransformationModule.imageHorizontalFlip === 'Y') {
        viewport.hflip = true;
        viewport.vflip = false;

        if (spatialTransformationModule.imageRotation !== undefined) {
            viewport.rotation = (360 - spatialTransformationModule.imageRotation) % 360;
        }
    } else {
        viewport.hflip = false;
        viewport.vflip = false;

        if (spatialTransformationModule.imageRotation !== undefined) {
            viewport.rotation = spatialTransformationModule.imageRotation;
        }
    }
}

//------------------------------------------------------------------------------
function applyDisplayedAreaModule(viewport, canvas, image, sopInstanceUid, presentationState) {
    const displayedAreaModule = presentationState.getDisplayedAreaModule();
    if (!displayedAreaModule || !displayedAreaModule.displayedAreas) {
        return;
    }

    const displayedArea = displayedAreaModule.displayedAreas.find(da => da.referencedImages && da.referencedImages.some(ri => ri.sopInstanceUid === sopInstanceUid));
    if (!displayedArea) {
        return;
    }

    if (displayedArea.presentationSizeMode && displayedArea.presentationSizeMode.toUpperCase() === 'MAGNIFY') {
        const aspoectRatio = displayedArea.presentationPixelAspectRatio && displayedArea.presentationPixelAspectRatio.split('\\');
        if (!aspoectRatio || aspoectRatio.length < 2) {
            return;
        }

        const scaleToApply = parseInt(aspoectRatio[1], 10);
        if (scaleToApply <= 0) {
            return;
        }

        viewport.scale = scaleToApply;
    } else {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const displayedAreaWidth = displayedArea.displayedAreaTopLeftHandCorner.x - displayedArea.displayedAreaBottomRightHandCorner.x;
        const displayedAreaHeight = displayedArea.displayedAreaTopLeftHandCorner.y - displayedArea.displayedAreaBottomRightHandCorner.y;

        const scaleToApply = Math.abs(displayedAreaWidth) >= Math.abs(displayedAreaHeight)
            ? Math.abs(canvasWidth / displayedAreaWidth)
            : Math.abs(canvasHeight / displayedAreaHeight);

        if (scaleToApply > 0) {
            viewport.scale = scaleToApply;
        }

        viewport.translation.x = (displayedArea.displayedAreaTopLeftHandCorner.x + displayedArea.displayedAreaBottomRightHandCorner.x - image.columns) / -2;
        viewport.translation.y = (displayedArea.displayedAreaTopLeftHandCorner.y + displayedArea.displayedAreaBottomRightHandCorner.y - image.rows) / -2;
    }
}

//------------------------------------------------------------------------------
function applySoftcopyVoiLutModule(viewport, sopInstanceUid, presentationState) {
    const softcopyVoiLutModule = presentationState.getSoftcopyVoiLutModule();
    if (!softcopyVoiLutModule || !softcopyVoiLutModule.voiLuts) {
        return;
    }

    const softcopyVoiLut = softcopyVoiLutModule.voiLuts.find(vl => vl.referencedImages && vl.referencedImages.some(ri => ri.sopInstanceUid === sopInstanceUid));

    if (softcopyVoiLut && softcopyVoiLut.windowCenter && softcopyVoiLut.windowWidth) {
        viewport.voi.windowCenter = softcopyVoiLut.windowCenter;
        viewport.voi.windowWidth = softcopyVoiLut.windowWidth;
    }
}

//------------------------------------------------------------------------------
function applyGraphicAnnotationModule(element, sopInstanceUid, presentationState) {
    const graphicAnnotationModule = presentationState.getGraphicAnnotationModule();
    if (!graphicAnnotationModule || !graphicAnnotationModule.graphicAnnotations) {
        return;
    }

    const graphicAnnotations = graphicAnnotationModule.graphicAnnotations.filter(da => da.referencedImages && da.referencedImages.some(ri => ri.sopInstanceUid === sopInstanceUid));
    if (!graphicAnnotations) {
        return;
    }

    graphicAnnotations.forEach((graphicAnnotation) => {
        drawGraphicAnnotation(element, graphicAnnotation);
    });
}

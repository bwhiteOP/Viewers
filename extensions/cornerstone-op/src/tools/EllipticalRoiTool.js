/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 12, 2020 by Jay Liu
 */

import UUID from 'uuid-js';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { drawHandles, addNewMeasurement } from '../overrides/internal';
import { toolsMapping } from '../toolsMapping';
import {
    applyPerfectModeTransform,
    calculateEllipseStatistics,
    calculateSUV,
    createTextBoxContent,
    findTextBoxAnchorPoints,
    getBoundingImageCoordinates,
    getUnit,
    pointInEllipse,
} from '../utils';

const {
    toolStyle,
    toolColors,
    getToolState,
} = cornerstoneTools;

const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');

const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const draw = cornerstoneTools.import('drawing/draw');
const drawEllipse = cornerstoneTools.import('drawing/drawEllipse');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');

const getROITextBoxCoords = cornerstoneTools.import('util/getROITextBoxCoords');
const getPixelSpacing = cornerstoneTools.import('util/getPixelSpacing');
const throttle = cornerstoneTools.import('util/throttle');

const cursors = cornerstoneTools.import('tools/cursors');

const getLogger = cornerstoneTools.import('util/getLogger');
const logger = getLogger(`tools:annotation:${toolsMapping.ellipticalRoi}Tool`);

/**
 * This module deals with the customized cornerstone EllipticalRoi tool.
 * Overridden for the following specific features:
 *  - Set UUID for each ROI (HV-3)
 *  - Assign ESC key to cancel tool placement
 *  - SUV calculation (HV-224)
 *  - Tool coloring (HV-234)
 *  - Text, Analysis and Show Analysis options (HV-256)
 *  - Perfect mode (HV-257)
 * @see https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/tools/annotation/EllipticalRoiTool.js
 */
 export class EllipticalRoiTool extends BaseAnnotationTool {

    constructor(props = {}) {
        const defaultProps = {
            name: toolsMapping.ellipticalRoi,
            supportedInteractionTypes: ['Mouse', 'Touch'],
            configuration: {
                // showMinMax: false,
                // showHounsfieldUnits: true,
                drawHandles: true,
                drawHandlesOnHover: true,
            },
            svgCursor: cursors.ellipticalRoiCursor,
        };

        super(props, defaultProps);

        this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);

        this.addNewMeasurement = addNewMeasurement.bind(this);

        // These are annoying no-ops to silence IDE error of uninitialized properties that are in the base class.
        this.name = this.name;
        this.configuration = this.configuration;
    }

    createNewMeasurement(eventData) {
        const goodEventData =
        eventData && eventData.currentPoints && eventData.currentPoints.image;

        if (!goodEventData) {
            logger.error(`required eventData not supplied to tool ${this.name}'s createNewMeasurement`);
            return;
        }

        // HV-256 - Create Presentation State
        // add id and keep analysis
        return {
            id: UUID.create().toString(),
            visible: true,
            active: true,
            color: undefined,
            invalidated: true,
            showAnalysis: true,
            handles: {
                start: {
                    x: eventData.currentPoints.image.x,
                    y: eventData.currentPoints.image.y,
                    highlight: true,
                    active: false,
                },
                end: {
                    x: eventData.currentPoints.image.x,
                    y: eventData.currentPoints.image.y,
                    highlight: true,
                    active: true,
                },
                initialRotation: eventData.viewport.rotation,
                textBox: {
                    active: false,
                    hasMoved: false,
                    movesIndependently: false,
                    drawnIndependently: true,
                    allowedOutsideImage: true,
                    hasBoundingBox: true,
                    analysis: '',
                },
            },
        };
    }

    pointNearTool(element, data, coords, interactionType) {
        const hasStartAndEndHandles = data && data.handles && data.handles.start && data.handles.end;
        const validParameters = hasStartAndEndHandles;

        if (!validParameters) {
            logger.warn(`invalid parameters supplied to tool ${this.name}'s pointNearTool`);
        }

        if (!validParameters || data.visible === false) {
            return false;
        }

        const distance = interactionType === 'mouse' ? 15 : 25;
        const startCanvas = cornerstone.pixelToCanvas(
            element,
            data.handles.start
        );
        const endCanvas = cornerstone.pixelToCanvas(
            element,
            data.handles.end
        );

        const minorEllipse = {
            left: Math.min(startCanvas.x, endCanvas.x) + distance / 2,
            top: Math.min(startCanvas.y, endCanvas.y) + distance / 2,
            width: Math.abs(startCanvas.x - endCanvas.x) - distance,
            height: Math.abs(startCanvas.y - endCanvas.y) - distance,
        };

        const majorEllipse = {
            left: Math.min(startCanvas.x, endCanvas.x) - distance / 2,
            top: Math.min(startCanvas.y, endCanvas.y) - distance / 2,
            width: Math.abs(startCanvas.x - endCanvas.x) + distance,
            height: Math.abs(startCanvas.y - endCanvas.y) + distance,
        };

        const pointInMinorEllipse = pointInEllipse(minorEllipse, coords);
        const pointInMajorEllipse = pointInEllipse(majorEllipse, coords);

        if (pointInMajorEllipse && !pointInMinorEllipse) {
            return true;
        }

        return false;
    }

    updateCachedStats(image, element, data) {
        const seriesModule = cornerstone.metaData.get('generalSeriesModule', image.imageId) || {};
        const {modality} = seriesModule;
        const pixelSpacing = getPixelSpacing(image);

        const stats = _calculateStats(
            image,
            element,
            data.handles,
            modality,
            pixelSpacing,
        );

        data.cachedStats = stats;
        data.invalidated = false;
    }

    renderToolData(evt) {
        const toolData = getToolState(evt.currentTarget, this.name);

        if (!toolData) {
            return;
        }

        const eventData = evt.detail;
        const { image, element } = eventData;
        const lineWidth = toolStyle.getToolWidth();
        const config = this.configuration;
        const { handleRadius, drawHandlesOnHover, showHounsfieldUnits } = config;
        const context = getNewContext(eventData.canvasContext.canvas);
        const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

        // Meta
        const seriesModule = cornerstone.metaData.get('generalSeriesModule', image.imageId) || {};

        // Pixel Spacing
        const {modality} = seriesModule;
        const hasPixelSpacing = rowPixelSpacing && colPixelSpacing;

        draw(context, context => {
            // If we have tool data for this element - iterate over each set and draw it
            for (let i = 0; i < toolData.data.length; i++) {
                const data = toolData.data[i];

                if (data.visible === false) {
                    continue;
                }

                // Configure
                // HV-3 Check which color the rendered tool should be
                let color = toolColors.getColorIfActive(data);
                if (color !== toolColors.getActiveColor() && data.color) {
                    ({ color } = data);
                }

                // HV-257 - Make it perfect roi if the perfect mode is active
                if (data.active && config.activePerfectMode) {
                    applyPerfectModeTransform(data);
                }

                setShadow(context, config);

                // Draw
                drawEllipse(
                    context,
                    element,
                    data.handles.start,
                    data.handles.end,
                    {
                        color,
                    },
                    'pixel',
                    data.handles.initialRotation
                );

                // If the tool configuration specifies to only draw the handles on hover / active, follow this logic
                const handleOptions = {
                    color,
                    handleRadius,
                    drawHandlesIfActive: drawHandlesOnHover,
                    drawAllHandles: drawHandlesOnHover && data.active === true
                };

                if (this.configuration.drawHandles) {
                    drawHandles(context, eventData, data.handles, handleOptions);
                }

                if (data.showAnalysis !== false) {
                    // Update textbox stats
                    if (data.invalidated === true) {
                        if (data.cachedStats) {
                            this.throttledUpdateCachedStats(image, element, data);
                        } else {
                            this.updateCachedStats(image, element, data);
                        }
                    }

                    // Default to textbox on right side of ROI
                    if (!data.handles.textBox.hasMoved) {
                        const defaultCoords = getROITextBoxCoords(
                            eventData.viewport,
                            data.handles
                        );

                        Object.assign(data.handles.textBox, defaultCoords);
                    }

                    const textBoxAnchorPoints = handles => findTextBoxAnchorPoints(handles.start, handles.end);
                    const textBoxContent = createTextBoxContent(
                        context,
                        image.color,
                        data.cachedStats,
                        modality,
                        hasPixelSpacing,
                        config
                    );

                    //  Skip if there is no text to display
                    if (textBoxContent.length < 1) {
                        context.restore();
                        continue;
                    }

                    // HV-256 - store text as analysis
                    data.handles.textBox.analysis = textBoxContent.join(' ');

                    data.unit = getUnit(modality, showHounsfieldUnits);

                    drawLinkedTextBox(
                        context,
                        element,
                        data.handles.textBox,
                        textBoxContent,
                        data.handles,
                        textBoxAnchorPoints,
                        color,
                        lineWidth,
                        10,
                        true
                    );
                }
            }
        });
    }
}

/**
 * @param {*} image
 * @param {*} element
 * @param {*} handles
 * @param {*} modality
 * @param {*} pixelSpacing
 * @returns {Object} The Stats object
 */
function _calculateStats(image, element, handles, modality, pixelSpacing) {
    // Retrieve the bounds of the ellipse in image coordinates
    const ellipseCoordinates = getBoundingImageCoordinates(
        handles.start,
        handles.end
    );

    // Retrieve the array of pixels that the ellipse bounds cover
    const pixels = cornerstone.getPixels(
        element,
        ellipseCoordinates.left,
        ellipseCoordinates.top,
        ellipseCoordinates.width,
        ellipseCoordinates.height
    );

    // Calculate the mean & standard deviation from the pixels and the ellipse details.
    const ellipseMeanStdDev = calculateEllipseStatistics(
        pixels,
        ellipseCoordinates
    );

    let meanStdDevSUV;

    if (modality === 'PT') {
        meanStdDevSUV = {
            mean: calculateSUV(image, ellipseMeanStdDev.mean, true) || 0,
            stdDev: calculateSUV(image, ellipseMeanStdDev.stdDev, true) || 0,
        };
    }

    // Calculate the image area from the ellipse dimensions and pixel spacing
    const area = Math.PI *
      ((ellipseCoordinates.width * (pixelSpacing.colPixelSpacing || 1)) / 2) *
      ((ellipseCoordinates.height * (pixelSpacing.rowPixelSpacing || 1)) / 2);

    return {
        area: area || 0,
        count: ellipseMeanStdDev.count || 0,
        mean: ellipseMeanStdDev.mean || 0,
        variance: ellipseMeanStdDev.variance || 0,
        stdDev: ellipseMeanStdDev.stdDev || 0,
        min: ellipseMeanStdDev.min || 0,
        max: ellipseMeanStdDev.max || 0,
        meanStdDevSUV,
    };
}

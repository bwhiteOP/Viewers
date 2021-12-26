/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * July 30, 2021 by Jay Liu
 */

/**
 * This module deals with creating freehand and polygonal ROI
 * Based on https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/tools/annotation/FreehandRoiTool.js
 * Overridden for the following specific features:
 *  - Set UUID for each ROI (HV-3)
 *  - Assign ESC key to cancel tool placement
 *  - SUV calculation (HV-224)
 *  - Text, Analysis and Show Analysis options (HV-256)
 *  - ability to customize freehand or polygonal.  The difference is mainly the mouse behaviour
 */

/* eslint-disable prefer-destructuring */

import uuid from 'uuid-js';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { keys } from '@onepacs/core';
import { drawHandles } from '../overrides/internal';
import { calculateSUV } from '../utils';

//@ts-ignore
const { ohif } = window;
const { app: { hotkeysManager } } = ohif;

const {
    getToolState,
    toolStyle,
    toolColors,
    FreehandRoiTool
} = cornerstoneTools;

const draw = cornerstoneTools.import('drawing/draw');
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const drawJoinedLines = cornerstoneTools.import('drawing/drawJoinedLines');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');
const throttle = cornerstoneTools.import('util/throttle');
const numbersWithCommas = cornerstoneTools.import('util/numbersWithCommas');
const { calculateFreehandStatistics } = cornerstoneTools.import('util/freehandUtils');


/**
 * @public
 * @class PolygonalRoiBase
 * @memberof Tools.Annotation
 * @classdesc Tool for drawing arbitrary polygonal regions of interest, and
 * measuring the statistics of the enclosed pixels.
 * @extends FreehandRoiTool
 */
export class PolygonalRoiBaseTool extends FreehandRoiTool {
    constructor(props = {}) {
        super(props);

        this._drawingKeyDownCallback = this._drawingKeyDownCallback.bind(this);
        this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
    }

    createNewMeasurement(eventData) {
        const measurementData = super.createNewMeasurement(eventData);
        if (!measurementData)
            return;

        return { ...measurementData, ...{
            id: uuid.create().toString(), // HV-3
            showAnalysis: true,
        }};
    }

    updateCachedStats(image, element, data) {
        if (data.handles.points.length === 0)
            return;

        super.updateCachedStats(image, element, data);

        // Define variables for the area and mean/standard deviation
        let meanStdDev, meanStdDevSUV;

        const seriesModule = cornerstone.metaData.get('generalSeriesModule', image.imageId);
        const modality = seriesModule ? seriesModule.modality : null;

        const { points } = data.handles;
        // If the data has been invalidated, and the tool is not currently active,
        // We need to calculate it again.

        // Retrieve the bounds of the ROI in image coordinates
        const bounds = {
            left: points[0].x,
            right: points[0].x,
            bottom: points[0].y,
            top: points[0].x,
        };

        for (let i = 0; i < points.length; i++) {
            bounds.left = Math.min(bounds.left, points[i].x);
            bounds.right = Math.max(bounds.right, points[i].x);
            bounds.bottom = Math.min(bounds.bottom, points[i].y);
            bounds.top = Math.max(bounds.top, points[i].y);
        }

        const polyBoundingBox = {
            left: bounds.left,
            top: bounds.bottom,
            width: Math.abs(bounds.right - bounds.left),
            height: Math.abs(bounds.top - bounds.bottom),
        };

        // Store the bounding box information for the text box
        data.polyBoundingBox = polyBoundingBox;

        // First, make sure this is not a color image, since no mean / standard
        // Deviation will be calculated for color images.
        if (!image.color) {
            // Retrieve the array of pixels that the ROI bounds cover
            const pixels = cornerstone.getPixels(
                element,
                polyBoundingBox.left,
                polyBoundingBox.top,
                polyBoundingBox.width,
                polyBoundingBox.height
            );

            // Calculate the mean & standard deviation from the pixels and the object shape
            meanStdDev = calculateFreehandStatistics.call(
                this,
                pixels,
                polyBoundingBox,
                data.handles.points
            );
            if (modality === 'PT') {
                // If the image is from a PET scan, use the DICOM tags to
                // Calculate the SUV from the mean and standard deviation.

                // Note that because we are using modality pixel values from getPixels, and
                // The calculateSUV routine also rescales to modality pixel values, we are first
                // Returning the values to storedPixel values before calcuating SUV with them.
                // TODO: Clean this up? Should we add an option to not scale in calculateSUV?
                meanStdDevSUV = {
                    mean: calculateSUV(
                        image,
                        (meanStdDev.mean - image.intercept) / image.slope
                    ),
                    stdDev: calculateSUV(
                        image,
                        (meanStdDev.stdDev - image.intercept) / image.slope
                    ),
                };
            }

            // If the mean and standard deviation values are sane, store them for later retrieval
            if (meanStdDev && !isNaN(meanStdDev.mean)) {
                data.meanStdDev = meanStdDev;
                data.meanStdDevSUV = meanStdDevSUV;
            }
        }
    }

    /**
     * @param {*} evt
     * @returns {undefined}
     */
    renderToolData(evt) {
        const eventData = evt.detail;

        // If we have no toolState for this element, return immediately as there is nothing to do
        // @ts-ignore
        const toolState = getToolState(evt.currentTarget, this.name);

        if (!toolState) {
            return;
        }

        const { image, element } = eventData;
        // @ts-ignore
        const config = this.configuration;
        const seriesModule = cornerstone.metaData.get(
            'generalSeriesModule',
            image.imageId
        );
        const modality = seriesModule ? seriesModule.modality : null;

        // We have tool data for this element - iterate over each one and draw it
        const context = getNewContext(eventData.canvasContext.canvas);
        const lineWidth = toolStyle.getToolWidth();

        for (let i = 0; i < toolState.data.length; i++) {
            const data = toolState.data[i];

            if (data.visible === false) {
                continue;
            }

            // @ts-ignore
            draw(context, context => {
                let color = toolColors.getColorIfActive(data);
                let fillColor;

                if (data.active) {
                    if (data.handles.invalidHandlePlacement) {
                        color = config.invalidColor;
                        fillColor = config.invalidColor;
                    } else {
                        color = toolColors.getColorIfActive(data);
                        fillColor = toolColors.getFillColor();
                    }
                } else {
                    fillColor = toolColors.getToolColor();
                }

                if (data.handles.points.length) {
                    for (let j = 0; j < data.handles.points.length; j++) {
                        const lines = [...data.handles.points[j].lines];
                        const points = data.handles.points;

                        if (j === points.length - 1 && !data.polyBoundingBox) {
                            // If it's still being actively drawn, keep the last line to
                            // The mouse location
                            lines.push(config.mouseLocation.handles.start);
                        }
                        drawJoinedLines(context, element, data.handles.points[j], lines, {
                            color,
                        });
                    }
                }

                // Draw handles

                const options = {
                    color,
                    fill: fillColor,
                };

                if (config.alwaysShowHandles || (data.active && data.polyBoundingBox)) {
                    // Render all handles
                    options.handleRadius = config.activeHandleRadius;

                    // @ts-ignore
                    if (this.configuration.drawHandles) {
                        drawHandles(context, eventData, data.handles.points, options);
                    }
                }

                if (data.canComplete) {
                    // Draw large handle at the origin if can complete drawing
                    options.handleRadius = config.completeHandleRadius;
                    const handle = data.handles.points[0];

                    // @ts-ignore
                    if (this.configuration.drawHandles) {
                        drawHandles(context, eventData, [handle], options);
                    }
                }

                if (data.active && !data.polyBoundingBox) {
                    // Draw handle at origin and at mouse if actively drawing
                    options.handleRadius = config.activeHandleRadius;

                    // @ts-ignore
                    if (this.configuration.drawHandles) {
                        drawHandles(
                            context,
                            eventData,
                            config.mouseLocation.handles,
                            options
                        );
                    }

                    const firstHandle = data.handles.points[0];

                    // @ts-ignore
                    if (this.configuration.drawHandles) {
                        drawHandles(context, eventData, [firstHandle], options);
                    }
                }

                if (data.showAnalysis) {
                    // Update textbox stats
                    if (data.invalidated === true && !data.active) {
                        if (data.meanStdDev && data.meanStdDevSUV && data.area) {
                            // @ts-ignore
                            this.throttledUpdateCachedStats(image, element, data);
                        } else {
                            this.updateCachedStats(image, element, data);
                        }
                    }

                    // Only render text if polygon ROI has been completed and freehand 'shiftKey' mode was not used:
                    if (data.polyBoundingBox && !data.handles.textBox.freehand) {
                        // If the textbox has not been moved by the user, it should be displayed on the right-most
                        // Side of the tool.
                        if (!data.handles.textBox.hasMoved) {
                            // Find the rightmost side of the polyBoundingBox at its vertical center, and place the textbox here
                            // Note that this calculates it in image coordinates
                            data.handles.textBox.x = data.polyBoundingBox.left + data.polyBoundingBox.width;
                            data.handles.textBox.y = data.polyBoundingBox.top + data.polyBoundingBox.height / 2;
                        }

                        const text = textBoxText.call(this, data);

                        drawLinkedTextBox(
                            context,
                            element,
                            data.handles.textBox,
                            text,
                            data.handles.points,
                            textBoxAnchorPoints,
                            color,
                            lineWidth,
                            0,
                            true
                        );
                    }
                }
            });
        }

        function textBoxText(data) {
            const { meanStdDev, meanStdDevSUV, area } = data;
            // Define an array to store the rows of text for the textbox
            const textLines = [];

            // If the mean and standard deviation values are present, display them
            if (meanStdDev && meanStdDev.mean !== undefined) {
                // If the modality is CT, add HU to denote Hounsfield Units
                let moSuffix = '';

                if (modality === 'CT') {
                    moSuffix = 'HU';
                }
                data.unit = moSuffix;

                // Create a line of text to display the mean and any units that were specified (i.e. HU)
                let meanText = `Mean: ${numbersWithCommas(
                    meanStdDev.mean.toFixed(2)
                )} ${moSuffix}`;
                // Create a line of text to display the standard deviation and any units that were specified (i.e. HU)
                let stdDevText = `StdDev: ${numbersWithCommas(
                    meanStdDev.stdDev.toFixed(2)
                )} ${moSuffix}`;

                // If this image has SUV values to display, concatenate them to the text line
                if (meanStdDevSUV && meanStdDevSUV.mean !== undefined) {
                    const SUVtext = ' SUV: ';

                    meanText += SUVtext + numbersWithCommas(meanStdDevSUV.mean.toFixed(2));
                    stdDevText += SUVtext + numbersWithCommas(meanStdDevSUV.stdDev.toFixed(2));
                }

                // Add these text lines to the array to be displayed in the textbox
                textLines.push(meanText);
                textLines.push(stdDevText);
            }

            // If the area is a sane value, display it
            if (area) {
                // Determine the area suffix based on the pixel spacing in the image.
                // If pixel spacing is present, use millimeters. Otherwise, use pixels.
                // This uses Char code 178 for a superscript 2
                let suffix = ` mm${String.fromCharCode(178)}`;

                if (!image.rowPixelSpacing || !image.columnPixelSpacing) {
                    suffix = ` pixels${String.fromCharCode(178)}`;
                }

                // Create a line of text to display the area and its units
                const areaText = `Area: ${numbersWithCommas(area.toFixed(2))}${suffix}`;

                // Add this text line to the array to be displayed in the textbox
                textLines.push(areaText);
            }

            return textLines;
        }

        function textBoxAnchorPoints(handles) {
            return handles;
        }
    }

    _activateDraw(element, interactionType = 'Mouse') {
        hotkeysManager.disable();
        document.addEventListener('keydown', this._drawingKeyDownCallback);
        super._activateDraw(element, interactionType);
    }

    _deactivateDraw(element) {
        document.addEventListener('keydown', this._drawingKeyDownCallback);
        hotkeysManager.enable();
        super._deactivateDraw(element);
    }

    /**
     * @param {KeyboardEvent} evt
     * @returns {boolean}}
     */
    _drawingKeyDownCallback(evt) {
        // If the Esc key was pressed, set the flag to true
        if (evt.which === keys.ESC) {
            // @ts-ignore
            this.cancelDrawing(this.element);
        }

        // Don't propagate this keydown event so it can't interfere
        // with anything outside of this tool
        return false;
    }
}

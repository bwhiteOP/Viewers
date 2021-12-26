/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 12, 2020 by Jay Liu
 */

import UUID from 'uuid-js';
import _ from 'lodash';
import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '../toolsMapping';
import { drawHandles, addNewMeasurement } from '../overrides/internal';

const { toolStyle, toolColors, getToolState } = cornerstoneTools;

const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const draw = cornerstoneTools.import('drawing/draw');
const drawLine = cornerstoneTools.import('drawing/drawLine');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');
const lineSegDistance = cornerstoneTools.import('util/lineSegDistance');
const getPixelSpacing = cornerstoneTools.import('util/getPixelSpacing');

const getLogger = cornerstoneTools.import('util/getLogger');
const logger = getLogger(`tools:annotation:${toolsMapping.length}Tool`);

/**
 * This module deals with the customized cornerstone LengthTool
 * Overridden for the following specific features:
 *  - Set UUID for each ROI (HV-3)
 *  - Assign ESC key to cancel tool placement
 *  - Make the grab area less greedy (HV-11)
 *  - Express measurement in cm if it is greater than 10 mm (HV-145)
 *  - Measurement precision (HV-269)
 *  - Analysis option
 * @see https://github.com/cornerstonejs/cornerstoneTools/blob/v4.20.1/src/tools/annotation/LengthTool.js
 */
export class LengthTool extends cornerstoneTools.LengthTool {

    constructor(props = {}) {
        super(_.merge({}, {
            name: toolsMapping.length,
            configuration: {
                hideHandles: true,
                drawHandlesOnHover: true,
            }
        }, props));

        this.addNewMeasurement = addNewMeasurement.bind(this);

        // These are annoying no-ops to silence IDE error of uninitialized properties that are in the base class.
        this.name = this.name;
        this.configuration = this.configuration;
        this.throttledUpdateCachedStats = this.throttledUpdateCachedStats;
        this.updateCachedStats = this.updateCachedStats;
    }

    createNewMeasurement(eventData) {
        const measurement = super.createNewMeasurement(eventData);
        if (!measurement) return;

        // HV-256 - Create Presentation State
        // add id and keep analysis
        return _.merge({}, measurement, {
            id: UUID.create().toString(),
            handles: {
                textBox: {
                    analysis: ''
                },
            },
        });
    }

    /**
     * @param {HTMLElement} element
     * @param {Object} data
     * @param {{x: number, y: number}} coords
     * @param {'mouse' | 'touch'} interactionType
     */
    pointNearTool(element, data, coords, interactionType) {
        const hasStartAndEndHandles = data && data.handles && data.handles.start && data.handles.end;
        const validParameters = hasStartAndEndHandles;

        if (!validParameters) {
            logger.warn(`invalid parameters supplied to tool ${this.name}'s pointNearTool`);
            return false;
        }

        if (data.visible === false) {
            return false;
        }

        // HV-119 Make the grab less greedy
        const grabDistance = interactionType === 'touch' ? 25 : 5;
        const distanceToPoint = lineSegDistance(element, data.handles.start, data.handles.end, coords);

        return distanceToPoint < grabDistance;
    }

    renderToolData(evt) {
        const eventData = evt.detail;
        const { handleRadius, drawHandlesOnHover, precision } = this.configuration;
        const toolData = getToolState(evt.currentTarget, this.name);

        if (!toolData) {
            return;
        }

        // We have tool data for this element - iterate over each one and draw it
        const context = getNewContext(eventData.canvasContext.canvas);
        const { image, element } = eventData;
        const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

        const lineWidth = toolStyle.getToolWidth();

        for (let i = 0; i < toolData.data.length; i++) {
            const data = toolData.data[i];

            if (data.visible === false) {
                continue;
            }

            draw(context, context => {
                // Configurable shadow
                setShadow(context, this.configuration);

                // HV-3 Check which color the rendered tool should be
                let color = toolColors.getColorIfActive(data);
                if (color !== toolColors.getActiveColor() && data.color) {
                    ({ color } = data);
                }

                // Draw the measurement line
                drawLine(context, element, data.handles.start, data.handles.end, {
                    color,
                });

                // Draw the handles
                const handleOptions = {
                    color,
                    handleRadius,
                    drawHandlesIfActive: drawHandlesOnHover,
                };

                if (this.configuration.drawHandles) {
                    drawHandles(context, eventData, data.handles, handleOptions);
                }

                if (!data.handles.textBox.hasMoved) {
                    const coords = {
                        x: Math.max(data.handles.start.x, data.handles.end.x),
                    };

                    // Depending on which handle has the largest x-value,
                    // Set the y-value for the text box
                    if (coords.x === data.handles.start.x) {
                        coords.y = data.handles.start.y;
                    } else {
                        coords.y = data.handles.end.y;
                    }

                    data.handles.textBox.x = coords.x;
                    data.handles.textBox.y = coords.y;
                }

                // Move the textbox slightly to the right and upwards
                // So that it sits beside the length tool handle
                const xOffset = 10;

                // Update textbox stats
                if (data.invalidated === true) {
                    if (data.length) {
                        this.throttledUpdateCachedStats(image, element, data);
                    } else {
                        this.updateCachedStats(image, element, data);
                    }
                }

                const text = textBoxText(data, rowPixelSpacing, colPixelSpacing, precision);

                drawLinkedTextBox(
                    context,
                    element,
                    data.handles.textBox,
                    text,
                    data.handles,
                    textBoxAnchorPoints,
                    color,
                    lineWidth,
                    xOffset,
                    true
                );
            });
        }
    }
}

// - SideEffect: Updates annotation 'suffix'
function textBoxText(annotation, rowPixelSpacing, colPixelSpacing, precision = 2) {
    let measuredValue = _sanitizeMeasuredValue(annotation.length);

    // measured value is not defined, return empty string
    if (!measuredValue) {
        return '';
    }

    // Set the length text suffix depending on whether or not pixelSpacing is available
    let suffix = 'mm';

    if (!rowPixelSpacing || !colPixelSpacing) {
        suffix = 'pixels';
    } else if (measuredValue > 10) {
        //  HV-115 Express measurement in cm if it is greater than 10 mm
        measuredValue /= 10;
        suffix = ' cm';
    }

    annotation.unit = suffix;

    const text = `${measuredValue.toFixed(precision)} ${suffix}`;

    // HV-256 - Determine and store the length measurement text with precision from user preferences
    annotation.handles.textBox.analysis = text;

    return text;
}

function textBoxAnchorPoints(handles) {
    const midpoint = {
        x: (handles.start.x + handles.end.x) / 2,
        y: (handles.start.y + handles.end.y) / 2,
    };

    return [handles.start, midpoint, handles.end];
}

/**
 * Attempts to sanitize a value by casting as a number; if unable to cast,
 * we return `undefined`
 *
 * @param {string|number} value
 * @returns a number or undefined
 */
function _sanitizeMeasuredValue(value) {
    const parsedValue = Number(value);
    const isNumber = !isNaN(parsedValue);

    return isNumber ? parsedValue : undefined;
}

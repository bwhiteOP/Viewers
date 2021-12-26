/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types, publicSettings } from '@onepacs/core';
import { Icon } from '../../Icon';

/**
 * @typedef {types.WithId<types.MouseToolset>} ToolsetRow
 */

/**
 * @param {Object} param
 * @param {ToolsetRow} param.row
 * @param {Function} param.onPlusClicked
 * @param {Function} param.onMinusClicked
 * @param {Function} param.onChanged
 */
export function MouseToolsetRow({ row, onPlusClicked, onMinusClicked, onChanged }) {
    /**
     * @param {types.MouseButton} button
     * @param {string} command
     */
    function onDropdownChanged(button, command) {
        row.value[button] = command;
        onChanged(row);
    }

    /** @param {types.MouseButton} button */
    function renderDropdown(button) {
        return (
            <Select
                value={row.value[button]}
                options={OPTIONS[button]}
                onChange={event => onDropdownChanged(button, event.target.value)}
            />
        )
    }

    return (
        <div className="toolsetRow">
            <div className="toolsetColumn left">{renderDropdown('Left')}</div>
            <div className="toolsetColumn middle">{renderDropdown('Middle')}</div>
            <div className="toolsetColumn right">{renderDropdown('Right')}</div>
            <div className="toolsetColumn button">
                { row.id === 0
                    ? (<button className="form-button btn btn-primary" onClick={_ => onPlusClicked(row.id)}>
                        <Icon name={'plus'} />
                    </button>)
                    : (<button className="form-button btn btn-danger" onClick={_ => onMinusClicked(row.id)}>
                        <Icon name={'minus'} />
                    </button>)
                }
            </div>
        </div>
    );
}

const LABELS = {
    stackScroll: 'Stack Scroll',
    zoom: 'Zoom',
    magnify: 'Magnify',
    wwwc: 'Levels',
    pan: 'Pan',
    length: 'Length',
    annotate: 'Annotate',
    angle: 'Angle',
    wwwcRegion: 'ROI Window',
    dragProbe: 'Probe',
    crosshairs: 'Crosshairs',
    ellipticalRoi: 'Ellipse',
    rectangleRoi: 'Rectangle',
    polygonalRoi: 'Polygon',
    freehandRoi: 'Freehand',
};

const OPTIONS = {
    Left: [
        'stackScroll',
        'zoom',
        'magnify',
        'wwwc',
        'pan',
        'length',
        'annotate',
        'angle',
        'wwwcRegion',
        'dragProbe',
        'crosshairs',
        'ellipticalRoi',
        'rectangleRoi',
        'polygonalRoi',
        'freehandRoi',
    ].map(x => makeOption(x)),

    Middle: [
        'stackScroll',
        'zoom',
        'magnify',
        'wwwc',
        'pan',
    ].map(x => makeOption(x)),

    Right: [
        'stackScroll',
        'zoom',
        'magnify',
        'wwwc',
        'pan',
    ].map(x => makeOption(x)),
};

/** @param {string} command */
function makeOption(command) {
    return { key: command, value: command, label: LABELS[command]};
}

MouseToolsetRow.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.shape({
            Left: PropTypes.string.isRequired,
            Middle: PropTypes.string.isRequired,
            Right: PropTypes.string.isRequired,
        })
    }).isRequired,
    onPlusClicked: PropTypes.func.isRequired,
    onMinusClicked: PropTypes.func.isRequired,
    onChanged: PropTypes.func.isRequired,
};

MouseToolsetRow.defaultProps = {
    row: {
        id: 0,
        value: {
            Left: publicSettings.cached().defaultMouseButtonTools?.left || 'stackScroll',
            Middle: publicSettings.cached().defaultMouseButtonTools?.middle || 'pan',
            Right: publicSettings.cached().defaultMouseButtonTools?.right || 'wwwc',
        }
    }
};

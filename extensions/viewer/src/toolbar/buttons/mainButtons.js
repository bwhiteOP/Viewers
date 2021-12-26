/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// @ts-check
/**
 * Copied and modified from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/extensions/cornerstone/src/toolbarModule.js
 * Icon names: https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/ui/src/elements/Icon/getIcon.js
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { toolsMapping } from '@onepacs/cornerstone';
import {
    canNavigatePreviousDisplaySet,
    canNavigateNextDisplaySet
} from '../../redux/selectors/navigation';
import LayoutButtonComponent from '../../components/Toolbar/LayoutButton';
import { TOOLBAR_BUTTON_TYPES } from './constants';

/** @type {types.ToolbarButton} */
export const stackScroll = {
    id: 'OP-StackScroll',
    label: 'Stack',
    icon: 'bars',
    tooltip: {
        title: 'Stack Tool',
        description: 'Stack/Scroll images up and down by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.stackScroll },
};

/** @type {types.ToolbarButton} */
export const zoom = {
    id: 'OP-Zoom',
    label: 'Zoom',
    icon: 'search-plus',
    tooltip: {
        title: 'Zoom Tool',
        description: 'Zoom images in and out by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.zoom },
};

/** @type {types.ToolbarButton} */
export const magnify = {
    id: 'OP-Magnify',
    label: 'Mag',
    icon: 'circle',
    tooltip: {
        title: 'Magnify Tool',
        description: 'Magnify region of images by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.magnify },
};

/** @type {types.ToolbarButton} */
export const wwwc = {
    id: 'OP-Wwwc',
    label: 'W/L',
    icon: 'level',
    tooltip: {
        title: 'Window/Level Tool',
        description: 'Adjust window/level of images by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.wwwc },
};

/** @type {types.ToolbarButton} */
export const pan = {
    id: 'OP-Pan',
    label: 'Pan',
    icon: 'arrows',
    tooltip: {
        title: 'Pan Tool',
        description: 'Adjust display position of images by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.pan },
};

/** @type {types.ToolbarButton} */
export const length = {
    id: 'OP-Length',
    label: 'Length',
    icon: 'measure-temp',
    tooltip: {
        title: 'Length Tool',
        description: 'Measure length by drawing lines on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.length },
};

/** @type {types.ToolbarButton} */
export const annotate = {
    id: 'OP-ArrowAnnotate',
    label: 'Arrow',
    icon: 'measure-non-target',
    tooltip: {
        title: 'Annotate Tool',
        description: 'Annotate images with text input'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.annotate },
};

/** @type {types.ToolbarButton} */
export const angle = {
    id: 'OP-Angle',
    label: 'Angle',
    icon: 'angle-left',
    tooltip: {
        title: 'Angle Tool',
        description: 'Measure angle on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.angle },
};

/** @type {types.ToolbarButton} */
export const reset = {
    id: 'OP-Reset',
    label: 'Reset',
    icon: 'reset',
    tooltip: {
        title: 'Reset Tool',
        description: 'Reset image manipulation on selected image'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'resetViewport',
};

/** @type {types.ToolbarButton} */
export const layout = {
    id: 'OP-Layout',
    label: 'Layout',
    tooltip: {
        title: 'Layout Tool',
        description: 'Set tile layout'
    },
    CustomComponent: LayoutButtonComponent
};

/** @type {types.ToolbarButton} */
export const cine ={
    id: 'OP-Cine',
    label: 'CINE',
    icon: 'youtube',
    tooltip: {
        title: 'Toggle CINE Controls',
        description: 'Show/Hide CINE controls to play/stop scrolling series at various speeds'
    },
    type: TOOLBAR_BUTTON_TYPES.BUILT_IN,
    options: {
        behavior: 'CINE'
    },
};

/** @type {types.ToolbarButton} */
export const wwwcRegion = {
    id: 'OP-WwwcRegion',
    label: 'ROI',
    icon: 'stop',
    tooltip: {
        title: 'Regional Window/Level Tool',
        description: 'Adjust window/level of images by region of rectangle drawn on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.wwwcRegion },
};

/** @type {types.ToolbarButton} */
export const probe = {
    id: 'OP-DragProbe',
    label: 'Probe',
    icon: 'dot-circle',
    tooltip: {
        title: 'Probe Tool',
        description: 'Display various pixel measurements (xy, SP, MO, etc) by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.dragProbe },
};

/** @type {types.ToolbarButton} */
export const crosshairs = {
    id: 'OP-Crosshairs',
    label: 'Crosshairs',
    icon: 'crosshairs',
    tooltip: {
        title: 'Crosshairs Tool',
        description: 'Display mouse position on other simultaneously displayed images by clicking and dragging mouse on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.crosshairs },
};

/** @type {types.ToolbarButton} */
export const ellipticalRoi = {
    id: 'OP-EllipticalRoi',
    label: 'Ellipse',
    icon: 'circle-o',
    tooltip: {
        title: 'Elliptical ROI Tool',
        description: 'Draw elliptibal region of interest with various measurements (Mean, StdDev, Area, etc) on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.ellipticalRoi },
};

/** @type {types.ToolbarButton} */
export const rectangleRoi = {
    id: 'OP-RectangleRoi',
    label: 'Rectangle',
    icon: 'square-o',
    tooltip: {
        title: 'Rectangular ROI Tool',
        description: 'Draw rectangular region of interest with various measurements (Mean, StdDev, Area, etc) on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.rectangleRoi },
};

/** @type {types.ToolbarButton} */
export const polygonalRoi = {
    id: 'OP-PolygonalRoi',
    label: 'Polygon',
    icon: 'star-o',
    tooltip: {
        title: 'Polygonal ROI Tool',
        description: 'Draw closed polygonal region of interest with various measurements (Mean, StdDev, Area, etc) on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.polygonalRoi },
};

/** @type {types.ToolbarButton} */
export const freehandRoi = {
    id: 'OP-FreehandRoi',
    label: 'Freehand',
    icon: 'freehand',
    tooltip: {
        title: 'Freehand ROI Tool',
        description: 'Draw closed freehand region of interest with various measurements (Mean, StdDev, Area, etc) on images'
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.freehandRoi },
};

/** @type {types.ToolbarButton} */
export const invert = {
    id: 'OP-Invert',
    label: 'Invert',
    icon: 'adjust',
    tooltip: {
        title: 'Invert Tool',
        description: 'Invert color palette of selected image'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'invertViewport',
};

/** @type {types.ToolbarButton} */
export const rotateR = {
    id: 'OP-RotateRight',
    label: 'Rotate',
    icon: 'rotate-right',
    tooltip: {
        title: 'Rotate Right Tool',
        description: 'Rotate selected image 90 degrees clockwise',
    },
    //
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'rotateViewportCW',
};

/** @type {types.ToolbarButton} */
export const previousDisplaySet = {
    id: 'OP-PreviousDisplaySet',
    label: 'Prev',
    icon: 'arrow-left',
    disableFunction: function (state) {
        return !canNavigatePreviousDisplaySet(state);
    },
    tooltip: {
        title: 'Previous Series Tool',
        description: 'Switch to the previous series'
    },
    //
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'previousViewportDisplaySet',
};

/** @type {types.ToolbarButton} */
export const nextDisplaySet = {
    id: 'OP-NextDisplaySet',
    label: 'Next',
    icon: 'arrow-right',
    disableFunction: function (state) {
        return !canNavigateNextDisplaySet(state);
    },
    tooltip: {
        title: 'Next Series Tool',
        description: 'Switch to the next series'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'nextViewportDisplaySet',
};

/** @type {types.ToolbarButton} */
export const flipH = {
    id: 'OP-FlipH',
    label: 'Flip H',
    icon: 'ellipse-h',
    tooltip: {
        title: 'Flip Horizontal Tool',
        description: 'Flip selected image horizontally'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'flipViewportHorizontal',
};

/** @type {types.ToolbarButton} */
export const flipV = {
    id: 'OP-FlipV',
    label: 'Flip V',
    icon: 'ellipse-v',
    tooltip: {
        title: 'Flip Vertical Tool',
        description: 'Flip selected image vertically'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'flipViewportVertical',
};

/** @type {types.ToolbarButton} */
export const savePR = {
    id: 'OP-SavePR',
    label: 'Save PR',
    icon: 'save',
    tooltip: {
        title: 'Save Presentation State Tool',
        description: 'Create and save Presentation State (PR) to OnePacs Server for selected image'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'savePR',
};

/** @type {types.ToolbarButton} */
export const clear = {
    id: 'OP-Clear',
    label: 'Clear',
    icon: 'trash',
    tooltip: {
        title: 'Clear Tools',
        description: 'Remove all measurements and annotations on selected image'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'clearTools',
};

/** @type {types.ToolbarButton} */
export const userPreferences = {
    id: 'OP-UserPreferences',
    label: 'Prefs',
    icon: 'user',
    tooltip: {
        title: 'Toggle User Preferences',
        description: 'Show/Hide user preferences dialog to change persisted user preferences'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'showUserPreferences'
};


/** @type {types.ToolbarButton} */
export const bidirectional = {
    id: 'OP-Bidirectional',
    label: 'Bidirectional',
    icon: 'measure-target',
    tooltip: {
        title: '',
        description: ''
    },
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: toolsMapping.bidirectional },
};

/** @type {types.ToolbarButton} */
export const download = {
    id: 'OP-Download',
    label: 'Exp. Img',
    icon: 'camera',
    tooltip: {
        title: 'Download Tool',
        description: 'Capture and download selected image with image manipulation and measurement'
    },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'showDownloadViewportModal',
    commandOptions: {
        title: 'Download High Quality Image'
    },
};

/** @type {types.ToolbarButton} */
export const exit2DMPR = {
    id: 'OP-Exit2DMPR',
    label: 'Exit 2D MPR',
    icon: 'times',
    // tooltip: {
    //     title: '',
    //     description: ''
    // },
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'setCornerstoneLayout',
    context: 'ACTIVE_VIEWPORT::VTK',
};

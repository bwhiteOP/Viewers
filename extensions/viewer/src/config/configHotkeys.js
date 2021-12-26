/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * July 21, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * This object defines the default supported hotkeys.
 * The ordering of the hotkeys is also important, as it determines
 * the ordering on the user preferences hotkeys tabs.
 * Available keys for binding: https://craig.is/killing/mice
 * @type {types.HotkeyCommand[]}
 */
export default [
    { commandName: 'defaultToolset', label: 'Default Toolset', keys: ['esc'] },
    { commandName: 'toggleToolset', label: 'Toggle Toolset', keys: ['t'] },
    { commandName: 'setZoomTool', label: 'Zoom', keys: ['z'] },
    { commandName: 'setWwwcTool', label: 'W/L', keys: ['w'] },
    { commandName: 'setPanTool', label: 'Pan', keys: ['p'] },
    { commandName: 'setAngleTool', label: 'Angle Measurement', keys: ['a'] },
    { commandName: 'setStackScrollTool', label: 'Scroll Stack', keys: ['s'] },
    { commandName: 'setMagnifyTool', label: 'Magnify', keys: ['m'] },
    { commandName: 'setLengthTool', label: 'Length Measurement', keys: [] },
    { commandName: 'setArrowAnnotateTool', label: 'Annotate', keys: [] },
    { commandName: 'setDragProbeTool', label: 'Pixel Probe', keys: [] },
    { commandName: 'setEllipticalRoiTool', label: 'Elliptical ROI', keys: [] },
    { commandName: 'setRectangleRoiTool', label: 'Rectangle ROI', keys: [] },
    { commandName: 'flipViewportHorizontal', label: 'Flip Horizontally', keys: ['h'] },
    { commandName: 'flipViewportVertical', label: 'Flip Vertically', keys: ['v'] },
    { commandName: 'rotateViewportCW', label: 'Rotate Right', keys: ['r'] },
    { commandName: 'rotateViewportCCW', label: 'Rotate Left', keys: ['l'] },
    { commandName: 'invertViewport', label: 'Invert', keys: ['i'] },
    { commandName: 'scaleUpViewport', label: 'Zoom In', keys: ['+'] },
    { commandName: 'scaleDownViewport', label: 'Zoom Out', keys: ['-'] },
    { commandName: 'fitViewportToWindow', label: 'Zoom to Fit', keys: ['='] },
    { commandName: 'resetViewport', label: 'Reset', keys: ['space'] },
    { commandName: 'clearTools', label: 'Clear Tools', keys: [] },
    { commandName: 'nextImage', label: 'Scroll Down', keys: [] },
    { commandName: 'previousImage', label: 'Scroll Up', keys: [] },
    { commandName: 'lastImage', label: 'Scroll to Last Image', keys: ['end'] },
    { commandName: 'firstImage', label: 'Scroll to First Image', keys: ['home'] },
    { commandName: 'previousViewportDisplaySet', label: 'Previous Series', keys: ['pageup'] },
    { commandName: 'nextViewportDisplaySet', label: 'Next Series', keys: ['pagedown'] },
    { commandName: 'decrementActiveViewport', label: 'Previous Panel', keys: [] },
    { commandName: 'incrementActiveViewport', label: 'Next Panel', keys: [] },
    { commandName: 'toggleOverlayTags', label: 'Toggle Image Annotations', keys: ['space'] },

    { commandName: 'toggleCinePlay', label: 'Play/Pause Cine', keys: [] },
    { commandName: 'toggleCineDialog', label: 'Show/Hide Cine Controls', keys: [] },
    { commandName: 'showDownloadViewportModal', label: 'Show/Hide Download Dialog', keys: [] },

    { commandName: 'windowLevelDefault', label: 'W/L Preset Default', keys: ['`'] },
    { commandName: 'windowLevelPreset1', label: 'W/L Preset 1', keys: ['1'] },
    { commandName: 'windowLevelPreset2', label: 'W/L Preset 2', keys: ['2'] },
    { commandName: 'windowLevelPreset3', label: 'W/L Preset 3', keys: ['3'] },
    { commandName: 'windowLevelPreset4', label: 'W/L Preset 4', keys: ['4'] },
    { commandName: 'windowLevelPreset5', label: 'W/L Preset 5', keys: ['5'] },
    { commandName: 'windowLevelPreset6', label: 'W/L Preset 6', keys: ['6'] },
    { commandName: 'windowLevelPreset7', label: 'W/L Preset 7', keys: ['7'] },
    { commandName: 'windowLevelPreset8', label: 'W/L Preset 8', keys: ['8'] },
    { commandName: 'windowLevelPreset9', label: 'W/L Preset 9', keys: ['9'] },
    { commandName: 'windowLevelPreset10', label: 'W/L Preset 10', keys: ['0'] },

    // { commandName: '', label: 'Save Presentation State', keys: [] },
    // { commandName: '', label: 'Hanging Protocol Editor', keys: [] },
    // { commandName: '', label: 'Previous Hanging Protocol Stage', keys: [] },
    // { commandName: '', label: 'Next Hanging Protocol Stage', keys: [] },
    // { commandName: '', label: 'Show/Hide Reference Lines', keys: [] },
    // { commandName: '', label: 'Link', keys: [] },
    // { commandName: '', label: 'DICOM Document', keys: [] },
    // { commandName: '', label: 'View Report', keys: [] },
    { commandName: 'showUserPreferences', label: 'Preference', keys: [] },
    { commandName: 'showAbout', label: 'About', keys: [] },
    { commandName: 'toggleScaleOverlay', label: 'Show/Hide Scale Overlay', keys: ['o'] },

    { commandName: 'panToLeft', label: 'Pan Left', keys: ['left'] },
    { commandName: 'panToRight', label: 'Pan Right', keys: ['right'] },
    { commandName: 'panToUp', label: 'Pan Up', keys: ['up'] },
    { commandName: 'panToDown', label: 'Pan Down', keys: ['down'] },
    // { commandName: '', label: 'Polygon', keys: [] },
    { commandName: 'setFreehandRoi', label: 'Freehand', keys: [] },

];

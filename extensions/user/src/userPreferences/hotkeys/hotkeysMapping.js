/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import _ from 'lodash';

/**
 * This object maps the 'hotkeys' user preferences from v1 to v2.
 * key: WebViewer v1 user preferences key
 * value: WebViewer v2 commandName
 */
export const HotkeysIdCommandMap = {
    defaultTool: 'defaultToolset',
    toggleToolset: 'toggleToolset',

    zoom: 'setZoomTool',
    wwwc: 'setWwwcTool',
    pan: 'setPanTool',
    angle: 'setAngleTool',
    stackScroll: 'setStackScrollTool',
    magnify: 'setMagnifyTool',
    length: 'setLengthTool',
    annotate: 'setArrowAnnotateTool',
    dragProbe: 'setDragProbeTool',
    ellipticalRoi: 'setEllipticalRoiTool',
    rectangleRoi: 'setRectangleRoiTool',

    // Viewport hotkeys
    flipH: 'flipViewportHorizontal',
    flipV: 'flipViewportVertical',
    rotateR: 'rotateViewportCW',
    rotateL: 'rotateViewportCCW',
    invert: 'invertViewport',
    zoomIn: 'scaleUpViewport',
    zoomOut: 'scaleDownViewport',
    zoomToFit: 'fitViewportToWindow',
    resetViewport: 'resetViewport',
    clearTools: 'clearTools',

    // Viewport navigation hotkeys
    scrollDown: 'nextImage',
    scrollUp: 'previousImage',
    scrollLastImage: 'lastImage',
    scrollFirstImage: 'firstImage',
    previousDisplaySet: 'previousViewportDisplaySet',
    nextDisplaySet: 'nextViewportDisplaySet',
    nextPanel: 'incrementActiveViewport',
    previousPanel: 'decrementActiveViewport',

    // Miscellaneous hotkeys
    toggleOverlayTags: 'toggleOverlayTags',
    toggleCinePlay: 'toggleCinePlay',
    toggleCineDialog: 'toggleCineDialog',
    toggleDownloadDialog: 'showDownloadViewportModal',

    // Preset hotkeys
    WLPreset0: 'windowLevelPreset1',
    WLPreset1: 'windowLevelPreset2',
    WLPreset2: 'windowLevelPreset3',
    WLPreset3: 'windowLevelPreset4',
    WLPreset4: 'windowLevelPreset5',
    WLPreset5: 'windowLevelPreset6',
    WLPreset6: 'windowLevelPreset7',
    WLPreset7: 'windowLevelPreset8',
    WLPreset8: 'windowLevelPreset9',
    WLPreset9: 'windowLevelPreset10',

    // savePR: '',
    // toggleHP: '',
    // previousHPStage: '',
    // nextHPStage: '',
    // toggleRefLines: '',
    // linkStackScroll: '',
    // toggleDocs: '',
    // viewReport: '',
    showUserPreferences: 'showUserPreferences',
    showAbout: 'showAbout',
    toggleScaleOverlay: 'toggleScaleOverlay',
    panToLeft: 'panToLeft',
    panToRight: 'panToRight',
    panToUp: 'panToUp',
    panToDown: 'panToDown',
    // polygonalRoi: '',
    freehandRoi: 'setFreehandRoi',
};

export const HotkeysCommandIdMap = _.invert(HotkeysIdCommandMap);

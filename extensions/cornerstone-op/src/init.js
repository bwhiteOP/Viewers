/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 23, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { publicSettings, types } from '@onepacs/core';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { toolsMapping } from './toolsMapping';
import { webSocketImageLoader, webImageLoader } from './image-loaders';
import {
    AngleTool,
    ArrowAnnotateTool,
    EllipticalRoiTool,
    RectangleRoiTool,
    LengthTool,
    FreehandRoiTool,
    PolygonalRoiTool,
    WwwcMultiTouchTool,
} from './tools';
import {
    createImage,
    convertColorSpace,
    imageCache,
    loadImage,
    loadAndCacheImage,
    registerImageLoader,
    registerUnknownImageLoader
} from './overrides';
import { onepacsMetadataProvider } from './metaData';
import { override, addAndActivateTool, getShowTextInputDialog } from './utils';

/** @param {types.ModuleFunctionParameters} param */
export default function({ appConfig, servicesManager }) {
    if (!appConfig.onePacs.useOnePacs)
        return;

    const { UIDialogService } = servicesManager.services;

    overrideCornerstone();
    initCornerstoneTools(UIDialogService);
    registerMetadataProvider();
    registerImageLoaders();
}

function overrideCornerstone() {
    override(cornerstone, 'imageCache', imageCache);
    override(cornerstone, 'loadImage', loadImage);
    override(cornerstone, 'loadAndCacheImage', loadAndCacheImage);
    override(cornerstone, 'registerImageLoader', registerImageLoader);
    override(cornerstone, 'registerUnknownImageLoader', registerUnknownImageLoader);

    override(cornerstoneWADOImageLoader, 'convertColorSpace', convertColorSpace);
    override(cornerstoneWADOImageLoader, 'createImage', createImage);
}

function registerMetadataProvider() {
    // this needs to be higher than the one provided by OHIF.
    cornerstone.metaData.addProvider(onepacsMetadataProvider, 10000);
    cornerstone.metaData.addProvider(cornerstoneWADOImageLoader.wadouri.metaData.metaDataProvider);
}

function registerImageLoaders() {
    cornerstone.registerImageLoader('websocket', webSocketImageLoader);
    cornerstone.registerImageLoader('http', webImageLoader);
    cornerstone.registerImageLoader('https', webImageLoader);
}

function initCornerstoneTools(UIDialogService) {
    const cachedSettings = publicSettings.cached();

    // Adding tools from cornerstoneTools that aren't added by OHIF by default.
    addAndActivateTool(toolsMapping.crosshairs, cornerstoneTools.CrosshairsTool, {}, true);
    addAndActivateTool('DoubleTapFitToWindow', cornerstoneTools.DoubleTapFitToWindowTool, {}, cachedSettings.defaultGestures.doubleTapZoom.enabled);
    addAndActivateTool('PanMultiTouch', cornerstoneTools.PanMultiTouchTool, {}, cachedSettings.defaultGestures.panMultiTouch.enabled);
    addAndActivateTool('StackScrollMultiTouch', cornerstoneTools.StackScrollMultiTouchTool, {}, cachedSettings.defaultGestures.stackScrollMultiTouch.enabled);
    addAndActivateTool('ZoomTouchPinch', cornerstoneTools.ZoomTouchPinchTool, {}, cachedSettings.defaultGestures.zoomTouchPinch.enabled);

    // Adding OnePacs tools
    // Note that any tools added here should also be added to the Measurement folder
    // so the tools created can be tracked by the MeasurementApi.
    // The ToolsMapping should also be updated so that toolset preferences remain functional.
    addAndActivateTool(toolsMapping.length, LengthTool, {}, true);
    addAndActivateTool(toolsMapping.ellipticalRoi, EllipticalRoiTool, {}, true);
    addAndActivateTool(toolsMapping.rectangleRoi, RectangleRoiTool, {}, true);
    addAndActivateTool(toolsMapping.freehandRoi, FreehandRoiTool, {}, true);
    addAndActivateTool(toolsMapping.polygonalRoi, PolygonalRoiTool, {}, true);
    addAndActivateTool(toolsMapping.angle, AngleTool, {}, true);
    addAndActivateTool(toolsMapping.annotate, ArrowAnnotateTool, {
        // override the default text input request callback
        // to use a dialog instead of browser prompt
        configuration: {
            getTextCallback: function(callback, eventDetails) {
                const showDialog = getShowTextInputDialog(UIDialogService);
                showDialog(null, eventDetails, callback);
            },
            changeTextCallback: function(data, eventDetails, callback) {
                const showDialog = getShowTextInputDialog(UIDialogService);
                showDialog(data, eventDetails, callback);
            }
        }
    }, true);

    // The multi-touch tools all use 2 pointers. So only one would work.
    addAndActivateTool(toolsMapping.wwwsMultiTouch, WwwcMultiTouchTool, {});
    // addAndActivateTool(toolNames.MagnifyMultiTouch, MagnifyMultiTouchTool, {});
    // addAndActivateTool(toolNames.ZoomMultiTouch, ZoomMultiTouchTool, {});

    // Set the active color of all tools
    // cornerstoneTools.toolColors.setActiveColor('Aqua');
}

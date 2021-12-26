/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * July 30, 2021 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import { toolsMapping } from '../toolsMapping';
import { PolygonalRoiBaseTool } from './PolygonalRoiBaseTool';

const MouseCursor = cornerstoneTools.import('tools/cursors/MouseCursor');
const deepmerge = cornerstoneTools.import('util/deepmerge');

/**
 * This is the same as the rectangleRoiCursor with addition of rotation.
 * Based on https://github.com/cornerstonejs/cornerstoneTools/blob/v4.22.0/src/tools/cursors/index.js#L208
 */
const rotatedRectangleRoiCursor = new MouseCursor(
    `<path transform="rotate(-45,896,832)" fill="ACTIVE_COLOR" d="M1312 256h-832q-66 0-113 47t-47 113v832q0 66 47
      113t113 47h832q66 0 113-47t47-113v-832q0-66-47-113t-113-47zm288 160v832q0
      119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119
      84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z"
    />`,
    {
        viewBox: {
            x: 1792,
            y: 1792,
        },
    }
);
  
/**
 * @public
 * @class PolygonalRoiTool
 * @memberof Tools.Annotation
 * @classdesc Tool for drawing arbitrary polygonal regions of interest, and
 * measuring the statistics of the enclosed pixels.
 * @extends PolygonalRoiBaseTool
 */
export class PolygonalRoiTool extends PolygonalRoiBaseTool {

    constructor(props = {}) {
        super(deepmerge({
            name: toolsMapping.polygonalRoi 
        }, props));

        // There is a bug with deepMerge
        // manually set our own cursor here
        this.svgCursor = rotatedRectangleRoiCursor;
    }

    _drawingDrag(evt) {
        // do nothing, disabled drag for PolygonalRoiTool
    }
}



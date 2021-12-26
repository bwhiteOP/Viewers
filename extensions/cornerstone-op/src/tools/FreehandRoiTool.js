/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * July 30, 2021 by Jay Liu
 */

import cornerstoneTools from 'cornerstone-tools';
import { PolygonalRoiBaseTool } from './PolygonalRoiBaseTool';
import { toolsMapping } from '../toolsMapping';

const deepmerge = cornerstoneTools.import('util/deepmerge');

/**
 * @public
 * @class FreehandRoiTool
 * @memberof Tools.Annotation
 * @classdesc Tool for drawing arbitrary polygonal regions of interest, and
 * measuring the statistics of the enclosed pixels.
 * @extends PolygonalRoiBaseTool
 */
export class FreehandRoiTool extends PolygonalRoiBaseTool {

    constructor(props = {}) {
        super(deepmerge({
            name: toolsMapping.freehandRoi 
        }, props));
    }

}

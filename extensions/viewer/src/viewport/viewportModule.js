/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

import { getCornerstoneViewportModule } from '../ohif';
import { Viewport as OnePacsViewport } from './Viewport';

/**
 * Override the viewportModule of the `cornerstone` extension.
 * Copied and modified from Viewers\extensions\cornerstone\src\index.js getViewportModule
 * This is a hack so that we can inject our own ViewportOverlay into the existing
 * OHIF cornerstone extension viewportModule without having to copy the entire
 * OHIFCornerstoneViewport (and dependencies) into OnePacs namespace.
 * @returns {void} not returning anything on purpose.
 */
export default function viewportModule() {
    const cornerstoneViewportModule = getCornerstoneViewportModule();
    cornerstoneViewportModule.module = OnePacsViewport;
}

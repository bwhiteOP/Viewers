/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 26, 2020 by Jay Liu
 */

import { getApp } from './getApp';

export function getCornerstoneViewportModule() {
    const { extensionManager } = getApp();
    const { viewportModule } = extensionManager.modules;
    const cornerstoneViewportModule = viewportModule.find(m => m.extensionId === 'cornerstone');
    return cornerstoneViewportModule;
}

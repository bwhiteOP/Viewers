/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 25, 2020 by Jay Liu
 */

import { publicSettings } from '@onepacs/core';

/**
 * Cornerstone Tools Configurations
 *
 * https://docs.cornerstonejs.org/
 * https://tools.cornerstonejs.org/
 */
export function getCornerstoneExtensionConfig() {
    const cachedSettings = publicSettings.cached();
    return {
        tools: {
            // The key of the tool should match the name of the tool.
            // Overrides to use the number of touchPointers defined in settings. (HV-214)
            // This config is only applied if the tool is already added.

            ScaleOverlay: {
                configuration: {
                    color: 'white'
                }
            },

            PanMultiTouch: {
                configuration: {
                    touchPointers: cachedSettings.defaultGestures.panMultiTouch.numPointers
                }
            },
            StackScrollMultiTouch: {
                configuration: {
                    touchPointers: cachedSettings.defaultGestures.stackScrollMultiTouch.numPointers
                }
            },
            MagnifyMultiTouch: {
                configuration: {
                    touchPointers: 2
                }
            },
            WwwcMultiTouch: {
                configuration: {
                    touchPointers: 2
                }
            },
            ZoomMultiTouch: {
                configuration: {
                    touchPointers: 2
                }
            },
        }
    };
}

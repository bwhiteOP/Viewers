/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

import _ from 'lodash';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * Clone a button definition but with modified id and additional properties.
 * @param {types.ToolbarButton} original
 * @param {Object} props
 * @returns {types.ToolbarButton}
 */
export function cloneButton(original, props = {}) {
    const button = _.cloneDeep(original);
    _.merge(button, props);
    if (button.commandOptions?.mouseButtonMask !== undefined) {
        const mouseButton = button.commandOptions.mouseButtonMask === 2 ? 'right' : 'left';
        button.id = `${button.id}-${mouseButton}`;
    }
    return button;
}

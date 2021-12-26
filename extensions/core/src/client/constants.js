/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 15, 2020 by Jay Liu
 */

/**
 * Taken from https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
 * @typedef {import('../types/general').MouseButtonMask} MouseButtonMask
 * @type {{[key: string]: MouseButtonMask}}
 */
export const MouseButtonMask = {
    None: 0,        // No button or un-initialized
    Primary: 1,     // Primary button (usually the left button)
    Secondary: 2,   // Secondary button (usually the right button)
    Auxiliary: 4,   // Auxiliary button (usually the mouse wheel button or middle button)
    Fourth: 8,      // 4th button (typically the "Browser Back" button)
    Figth: 16,      // 5th button (typically the "Browser Forward" button)
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 19, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/** @type {{ ohif: types.OHIF }} */
// @ts-ignore
const { ohif } = window;
const { app } = ohif;

/**
 * Gets the root app.
 * The `window.ohif` is set by OHIF `platform/viewers/src/App.js`.
 * All access to `window.ohif` should use this instead of directly
 * from the `window` object.
 */
export function getApp() {
    return app;
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * July 21, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { userExtension } from '@onepacs/user';
import { cornerstoneExtension } from '@onepacs/cornerstone';
import { presentationStateExtension } from '@onepacs/presentation-state';
import { viewerExtension } from '../extension';

/**
 * This file imports a list of OnePacsWebViewer build-time extensions.
 * @see https://docs.ohif.org/extensions/
 * @type {types.Extension[]}
 */
export default [
    // order matters, based on their dependencies
    userExtension,
    cornerstoneExtension,
    presentationStateExtension,
    viewerExtension
];

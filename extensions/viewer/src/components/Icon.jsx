/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 13, 2020 by Jay Liu
 */

// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

import { ICONS as OhifIcons } from '@ohif/ui';
import arrowLeft from '../public/assets/arrow-left.svg';
import arrowRight from '../public/assets/arrow-right.svg';
import camera from '../public/assets/camera.svg';
import caretLeft from '../public/assets/caret-left.svg';
import caretRight from '../public/assets/caret-right.svg';
import freehand from '../public/assets/freehand.svg';
import mouseLeft from '../public/assets/mouse-left.svg';
import mouseRight from '../public/assets/mouse-right.svg';
import reflines from '../public/assets/reflines.svg';
import minus from '../public/assets/minus.svg';
import starO from '../public/assets/star-o.svg';

// Obtain more icons from fontawesome free icon set
// https://fontawesome.com/icons?d=gallery&q=arrow

const OnePacsIcons = {
    'arrow-left': arrowLeft,
    'arrow-right': arrowRight,
    camera,
    'caret-left': caretLeft,
    'caret-right': caretRight,
    freehand,
    'mouse-left': mouseLeft,
    'mouse-right': mouseRight,
    reflines,
    minus,
    'star-o': starO
}

/**
 * Return the matching SVG Icon as a React Component.
 * Results in an inlined SVG Element. If there's no match,
 * return `null`
 */
export function Icon(props) {
    const { name: key } = props;

    if (!key) {
        return React.createElement('div', null, 'Missing icon key');
    }

    if (OhifIcons[key]) {
        return React.createElement(OhifIcons[key], props);
    } else if (OnePacsIcons[key]) {
        return React.createElement(OnePacsIcons[key], props);
    } else {
        return React.createElement('div', null, 'Missing Icon');
    }
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
}

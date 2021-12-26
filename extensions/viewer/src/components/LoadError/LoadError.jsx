/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

import './LoadError.styl';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {{ message: string, error?: Error}} param0
 */
export function LoadError({ message = 'Error loading study.', error = undefined }) {
    return (
        <div className={'load-error'}>
            <h3>{message} {error ? error.message : ''}</h3>
        </div>
    );
}

LoadError.propTypes = {
    message: PropTypes.string.isRequired,
    error: PropTypes.instanceOf(Error),
};

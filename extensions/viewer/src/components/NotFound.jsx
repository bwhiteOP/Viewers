/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * January 28, 2021 by PoyangLiu
 */

import React from 'react';
import PropTypes from 'prop-types';

function NotFound({ message = 'The page you requested was not found.' }) {
    return (
        <div className={'not-found'}>
            <h2>{message}</h2>
        </div>
    );
}

NotFound.propTypes = {
    message: PropTypes.string,
};

export default NotFound;
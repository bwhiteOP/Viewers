/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import './LogoIcon.styl';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// @ts-ignore
import logoImage from '../../public/assets/logo.png';

export function LogoIcon({ onClick }) {
    const logoClass = classnames('logo', { clickable: onClick !== undefined });
    return (
        <div className={logoClass}>
            <img src={logoImage} alt="logo" onClick={onClick} />
        </div>
    )
}

LogoIcon.propTypes = {
    onClick: PropTypes.func,
};

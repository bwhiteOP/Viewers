/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

import './StudyListHeader.styl';

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Logo } from '../Logo';

function StudyListHeader({ count, total }) {
    const { t } = useTranslation('StudyList');

    return (
        <div className='study-list-header'>
            <Logo />
            <div className='header'>{t('OnePacsStudyList')}</div>
            <div className='study-count'>Showing {count} of {total}</div>
        </div>
    );
}

StudyListHeader.propTypes = {
    count: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default StudyListHeader;

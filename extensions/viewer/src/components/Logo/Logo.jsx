/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '@ohif/ui';
import { AboutContent } from './AboutContent';
import { LogoIcon } from './LogoIcon';

export function Logo() {
    const { t } = useTranslation('Common');
    const modalService = useModal();

    function onClick() {
        modalService.show({
            title: t('About'),
            content: AboutContent
        });
    }

    return (
        <LogoIcon onClick={onClick} />
    )
}

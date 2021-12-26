/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import './AboutContent.styl';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { appInfo } from '@onepacs/core';
import { LogoIcon } from './LogoIcon';

export function AboutContent() {
    const { t } = useTranslation(['AboutContent', 'Common']);

    const version = appInfo?.version || '';
    return (
        <div className="AboutContent">
            <div className="logo flex-h">
                <LogoIcon />
                <div className="logoText">
                    {t('Common:OnePacsWebViewer')}
                </div>
            </div>
            <div className="version">
                {t('Common:Version')}: {version}
            </div>
            <div className="btn-group">
                <div className="btn btn-default">
                    <a target="_blank" rel="noopener noreferrer" href={'https://onepacshelp.com/display/WV'}>
                        {t('WebViewerDocumentation')}
                    </a>
                </div>
                <div className="btn btn-default">
                    <a target="_blank" rel="noopener noreferrer" href={'http://www.onepacsforums.com'}>
                        {t('OnePacsUserForums')}
                    </a>
                </div>
            </div>
        </div>
    )
}

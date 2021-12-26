/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useOhifContext } from '../../hooks';
import { getPanelButtonGroups } from './ToolbarRowHelpers';

/**
 * A custom hooks that provide the toolbarButton groups for activating the side panels.
 * @param {types.OHIFStudy[]} studies
 */
export function usePanelButtonGroups(studies) {
    const { activeContexts } = useOhifContext();
    const { t } = useTranslation(['Common'])

    /**
     * The button groups for toggling the left/right panel
     * @type {types.useState<types.LeftRight<import('./ToolbarRowHelpers').ButtonGroup[]>>}
     */
    const [buttonGroups, setButtonGroups] = useState({left: [], right: []});

    useEffect(() => {
        const newButtonGroups = getPanelButtonGroups(activeContexts, studies);
        // TODO: This should come from extensions, instead of being baked in
        newButtonGroups.left.unshift({
            value: 'studies',
            icon: 'th-large',
            bottomLabel: t('Series'),
        });
        setButtonGroups(newButtonGroups)
    }, [activeContexts, studies, t]);

    return buttonGroups;
}

/**
 * @typedef {import('./ToolbarRowHelpers').ButtonGroup} ButtonGroup
 */

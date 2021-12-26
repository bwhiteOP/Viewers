/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 17, 2020 by Jay Liu
 */

import './UserPreferences.styl';

import React from 'react';
import PropTypes from 'prop-types';
import { TabComponents } from '@ohif/ui';

import { GeneralPreferences } from './General';
import { LayoutPreferences } from './Layout';
import { AnnotationPreferences } from './Annotation';
import { MouseToolsetsPreferences } from './MouseToolsets';
import { HotkeysPreferences } from './HotKeys';
import { WindowLevelPreferences } from './WindowLevel';
import { SuvPreferences } from './SUV';
import { AdvancedPreferences } from './Advanced';

const tabs = [
    {
        name: 'General',
        Component: GeneralPreferences,
        customProps: {},
    },
    {
        name: 'Layout',
        Component: LayoutPreferences,
        customProps: {},
    },
    {
        name: 'Annotation',
        Component: AnnotationPreferences,
        customProps: {},
    },
    {
        name: 'Toolsets',
        Component: MouseToolsetsPreferences,
        customProps: {},
    },
    {
        name: 'Keyboard Shortcuts',
        Component: HotkeysPreferences,
        customProps: {},
    },
    {
        name: 'Window/Level Presets',
        Component: WindowLevelPreferences,
        customProps: {},
    },
    {
        name: 'SUV',
        Component: SuvPreferences,
        customProps: {},
    },
    {
        name: 'Advanced',
        Component: AdvancedPreferences,
        customProps: {},
    },
];

function UserPreferences({ hide }) {
    const customProps = {
        onClose: hide,
    };
    return <TabComponents tabs={tabs} customProps={customProps} />;
}

UserPreferences.propTypes = {
    hide: PropTypes.func,
};

export { UserPreferences };

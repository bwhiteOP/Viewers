/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MODULE_TYPES } from '@ohif/core';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUserPreferences } from '@onepacs/user';
import { useUserPreferences } from '../../../hooks/user';
import { getApp } from '../../../ohif';

const { isUserPreferencesFirstLoaded } = reduxUserPreferences.selectors;

/**
 * @typedef {Object} Panels
 * @prop {React.ComponentClass<any>=} left
 * @prop {React.ComponentClass<any>=} right
 */

export function usePanels() {
    const components = useRef(getPanelComponents());
    const leftPanel = usePanel('left', components.current);
    const rightPanel = usePanel('right', components.current);
    return { leftPanel, rightPanel };
}

/**
 * @param {string} side
 * @param {types.PanelComponent[]} components
 */
function usePanel(side, components) {
    const [isOpen, setIsOpen] = useState(false);
    const [panelId, setPanelId] = useState(/** @type {string} */(undefined));
    const isUserPreferencesLoadedFirstTime = useSelector(isUserPreferencesFirstLoaded);
    const [preferences, , savePreferences] = useUserPreferences('panel');
    const panel = panelId ? components.find(c => c.id === panelId) : undefined;

    useEffect(() => {
        if (!isUserPreferencesLoadedFirstTime) return;

        const panelPref = side === 'left' ? preferences.left : preferences.right;
        setIsOpen(panelPref?.isOpen || false);
        setPanelId(panelPref?.panel);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUserPreferencesLoadedFirstTime]);

    /** @param {string} newPanelId */
    function selectPanel(newPanelId) {
        if (newPanelId === null)
            newPanelId = undefined;

        const isSameSelectedPanel = newPanelId === panelId || panelId === null;
        setPanelId(newPanelId);

        let newIsOpen = isOpen;
        if (isSameSelectedPanel) {
            newIsOpen = !isOpen; // toggle
        } else if (!newPanelId) {
            newIsOpen = false; // nothing selected, close
        } else if (!isOpen) {
            newIsOpen = true;
        }
        setIsOpen(newIsOpen);

        if (isOpen !== newIsOpen && panelId !==  newPanelId) {
            preferences[side] = {
                isOpen: newIsOpen,
                panel: newPanelId
            };
            savePreferences(preferences);
        }
    }

    return { isOpen, panelId, panel, selectPanel };
}

/**
 * @returns {types.PanelComponent[]}
 */
function getPanelComponents() {
    const { extensionManager } = getApp();

    /** @type {{ module: types.PanelModule}[]} */
    const panelExtensions = extensionManager.modules[MODULE_TYPES.PANEL];
    const panelComponents = panelExtensions.flatMap(extension => extension.module.components);
    return panelComponents;
}

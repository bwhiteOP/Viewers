/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import { useState, useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import {
    useOhifContext,
    useWindowSize,
    useWindowOrientation,
    useCineDialog,
    useUserPreferences
} from '../../hooks';
import {
    getActiveToolsNames,
    getActiveButtons,
    getToolbarButtons,
    getDisplayedButtons,
} from './ToolbarRowHelpers';

/**
 * A custom hook that helps to determine the toolbar buttons to be displayed.
 */
export function useToolbarButtons() {
    const { appConfig, activeContexts } = useOhifContext();

    // Needed to compute nested buttons in the "More" expandable button. The actual values don't matter.
    const windowSize = useWindowSize();
    const windowOrientation = useWindowOrientation();
    const [ wlPresetPreferences ] = useUserPreferences('wlPresets');
    const [ mouseToolsetsPreferences ] = useUserPreferences('mouseToolsets');

    const [isCineDialogShown, toggleCineDialog] = useCineDialog();

    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const toolbarRowRef = useRef(null);

    /**
     * The buttons that are relevant on the toolbar.
     * @type {types.useState<types.ToolbarButton[]>}
     */
    const [toolbarButtons, setToolbarButtons] = useState([]);

    /**
     * The buttons that are to be displayed on the toolbar.
     * This is a subset of the toolbarButtons.
     * Some buttons may become nested into other parent buttons.
     * @type {types.useState<types.ToolbarButton[]>}
     */
    const [displayedButtons, setDisplayedButtons] = useState([]);

    /**
     * The name of the tools that are active for the left/right mouse tools
     * @type {types.useState<types.LeftRight<string>>}
     */
    const [activeToolNames, setActiveToolNames] = useState({});

    /**
     * The buttons that are currently active
     * @type {types.useState<types.ToolbarButton[]>}
     */
    const [activeButtons, setActiveButtons] = useState([]);

    /**
     * One-time initialization on component mount.
     * Used to determine the name of the tools that should be active.
     */
    useEffect(() => {
        function updateActiveToolNames() {
            const toolNames = getActiveToolsNames();
            setActiveToolNames(toolNames);
        }

        cornerstone.events.addEventListener(
            cornerstone.EVENTS.ELEMENT_ENABLED,
            updateActiveToolNames);

        return function componentCleanup() {
            cornerstone.events.removeEventListener(
                cornerstone.EVENTS.ELEMENT_ENABLED,
                updateActiveToolNames);
        };
    }, [] /* run one-time */)

    /**
     * When active context, appconfig and wlPresetPreferences change,
     * Get all the toolbarButtons again.
     */
    useEffect(() => {
        const buttons = getToolbarButtons(activeContexts, appConfig);
        if (buttons.length > 0) {
            setToolbarButtons(buttons)
        }
    }, [activeContexts, appConfig, wlPresetPreferences]);

    /**
     * When available buttons, window size/orientation changes,
     * re-organize buttons to be displayed.
     */
    useEffect(() => {
        const buttons = getDisplayedButtons(toolbarButtons, toolbarRowRef.current);
        if (buttons.length > 0) {
            setDisplayedButtons(buttons)
        }
    }, [toolbarButtons, toolbarRowRef, windowSize, windowOrientation]);

    /**
     * When active toolNames or display buttons changed,
     * Determine the active buttons.
     */
    useEffect(() => {
        const buttons = getActiveButtons(displayedButtons, activeToolNames);
        if (buttons.length > 0) {
            setActiveButtons(buttons);
        }
    }, [activeToolNames, displayedButtons]);

    /**
     * When toolset preferences change.
     * Update left/right button label
     */
    useEffect(() => {
        const newActiveToolNames = getActiveToolsNames();
        setActiveToolNames(newActiveToolNames);
    }, [mouseToolsetsPreferences]);

    function setButtonActive(button) {
        const toggables = activeButtons.filter(button => button.options && !button.options.togglable);
        const newActiveToolNames = getActiveToolsNames();
        const newActiveButtons = getActiveButtons(displayedButtons, activeToolNames);
        setActiveToolNames(newActiveToolNames);
        setActiveButtons([...toggables, ...newActiveButtons]);
    }

    function toggleCineButton(button) {
        if (isCineDialogShown) {
            setActiveButtons([...activeButtons.filter(b => b.id !== button.id)]);
        } else {
            setActiveButtons([...activeButtons, button]);
        }

        toggleCineDialog();
    }

    return {
        toolbarRowRef,
        displayedButtons,
        activeButtons,
        setButtonActive,
        toggleCineButton
    }

}

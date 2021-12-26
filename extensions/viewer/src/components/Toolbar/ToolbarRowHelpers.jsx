/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, arrayUtils, MouseButtonMask, getState } from '@onepacs/core';
import React from 'react';
import { MODULE_TYPES } from '@ohif/core';
import { getActiveTool } from '@onepacs/cornerstone';

import ToolbarButton from './ToolbarButton';
import ExpandableToolMenu from './ExpandableToolMenu';
import { getApp } from '../../ohif';

/**
 * @callback ButtonClickedCallback
 * @param {types.ToolbarButton} button
 * @param {MouseEvent} [event]
 * @param {*} [props]
 * @returns {void}
 *
 * @typedef {Object} ButtonGroup
 * @prop {string} value
 * @prop {string} icon
 * @prop {string} bottomLabel
 */

/**
 * Run a command using the commandsManager.
 * @param {string} commandName
 * @param {*} options
 * @param {types.ViewportContext?} context
 */
export function runCommand(commandName, options, context = undefined) {
    const { commandsManager } = getApp();
    commandsManager.runCommand(commandName, options, context);
}

/**
 * Get the active tool names for the left and right mouse buttons
 * @returns {types.LeftRight<string>}
 */
export function getActiveToolsNames() {
    return {
        left: getActiveTool(MouseButtonMask.Primary)?.name,
        right: getActiveTool(MouseButtonMask.Secondary)?.name
    };
}
/**
 * Get the active ToolbarButtons
 * @param {types.ToolbarButton[]} buttons
 * @param {types.LeftRight<string>} toolNames
 * @returns {types.ToolbarButton[]} active buttons
 */
export function getActiveButtons(buttons, toolNames) {
    const activeButtons = [];

    if (toolNames.left) {
        const button = getButtonsForToolName(buttons, toolNames.left, MouseButtonMask.Primary)[0] /* take the first one only */
        button && activeButtons.push(button);
    }
    if (toolNames.right) {
        const button = getButtonsForToolName(buttons, toolNames.right, MouseButtonMask.Secondary)[0] /* take the first one only */
        button && activeButtons.push(button);
    }

    return activeButtons;
}

/**
 * Get a list of buttons (and children buttons) that matches the toolname and mouseButton mask.
 * @param {types.ToolbarButton[]} buttons
 * @param {string} toolName
 * @param {types.MouseButtonMask} mouseButtonMask
 * @returns {types.ToolbarButton[]} matching buttons
 */
function getButtonsForToolName(buttons, toolName, mouseButtonMask) {
    if (!toolName) return [];
    if (!buttons || buttons.length === 0) return [];

    const found = [];
    buttons.forEach(b => {
        if (toolName === b.commandOptions?.toolName && mouseButtonMask === b.commandOptions?.mouseButtonMask)
            found.push(b);

        const foundChildren = getButtonsForToolName(b.buttons, toolName, mouseButtonMask);
        if (foundChildren.length > 0)
            found.push(foundChildren);
    });

    return found.flat();
}


/**
 * Get a list of ToolbarButton definitions from extension that are relevant to the active contexts.
 * @param {string[]} activeContexts
 * @param {Object} appConfig
 * @returns {types.ToolbarButton[]} buttons that are relevant to the active contexts.
 */
export function getToolbarButtons(activeContexts, appConfig) {
    const { extensionManager } = getApp();
    let toolbarExtensions = extensionManager.modules[MODULE_TYPES.TOOLBAR];

    if (appConfig.onePacs.useOnePacs) {
        // Exclude 'cornerstone' toolbarModule. OnePacs is providing its own.
        toolbarExtensions = toolbarExtensions
            .filter(ext => ext.extensionId !== 'cornerstone');
    }

    /** @type {types.ToolbarModule[]} */
    const toolbarModules = toolbarExtensions.map(ext => ext.module);

    const toolbarButtons = [];
    toolbarModules.forEach(module => {
        const moduleContext = Array.isArray(module.defaultContext) && module.defaultContext.length > 0
            ? module.defaultContext[0]
            : (/** @type {string} */ (module.defaultContext));

        const definitions = typeof module.definitions === 'function'
            ? module.definitions(getState())
            : module.definitions;

        definitions.map(button => {
            if (activeContexts.includes(button.context || moduleContext)) {
                toolbarButtons.push(button);
            }
        });

    });

    return toolbarButtons;
}

/**
 * Re-organize the buttons and hide extra buttons in a "More" button if necessary.
 * Returns a list of buttons to be displayed on the toolbar.
 * @param {types.ToolbarButton[]} buttons
 * @param {HTMLDivElement} [rowElement]
 * @returns {types.ToolbarButton[]}
 */
export function getDisplayedButtons(buttons, rowElement) {
    if (!rowElement || buttons.length < 2) {
        return buttons; // nothing to do
    }

    /**
     * @param {Element} element
     * @returns {number} the width
     */
    function getWidth(element) {
        if (!element) return 0;
        return (/** @type {HTMLDivElement} */ (element)).offsetWidth;
    }

    /**
     * @param {Element} containerElement
     * @param {string} text
     * @returns {number} the estimated width
     */
    function getEstimateTextWidth(containerElement, text, minWidth = 60) {
        // Add a fake node to the document
        const tempElement = document.createElement('div');
        tempElement.innerText = text;
        containerElement.appendChild(tempElement);
        // Get width and remove the temp node
        const width = getWidth(tempElement);
        containerElement.removeChild(tempElement);
        return Math.max(minWidth, width);
    }

    const logo = rowElement.children[0];
    const leftPanelButton = rowElement.children[1];
    const buttonsContainer = rowElement.children[2];
    const rightPanelButton = rowElement.children[3];

    const totalWidth = getWidth(rowElement);
    const logoWidth = getWidth(logo);
    const leftPanelButtonWidth = getWidth(leftPanelButton);
    const rightPanelButtonWidth = getWidth(rightPanelButton);

    // Determine the starting index of the buttons that need to be moved.
    const toggleMoreButtonWidth = 60; // This is an estimate
    const availableToolbarButtonsWidth = totalWidth - logoWidth - leftPanelButtonWidth - rightPanelButtonWidth;
    let toolbarButtonsWidth = toggleMoreButtonWidth;
    let firstIndexOfButtonsToMove = -1;
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const buttonEl = buttonsContainer.querySelector(`#${CSS.escape(button.id)}`);
        const buttonWidth = buttonEl ? getWidth(buttonEl) : getEstimateTextWidth(buttonsContainer, button.label);
        toolbarButtonsWidth += buttonWidth;
        if (toolbarButtonsWidth > availableToolbarButtonsWidth) {
            firstIndexOfButtonsToMove = i;
            break;
        }
    }

    if (firstIndexOfButtonsToMove < 1) {
        return buttons; // nothing to move
    }

    //  Move the buttons into "More" if they are overflowed in toolbar
    const rearrangedButtons = buttons.slice();
    const overflowToolbarButtons = rearrangedButtons.splice(firstIndexOfButtonsToMove);
    rearrangedButtons.push({
        id: 'OP-More',
        label: 'More',
        icon: 'ellipse-circle',
        buttons: overflowToolbarButtons
    });

    return rearrangedButtons;
}

/**
 * Gets the left/right button groups from panel module extensions.
 * @param {string[]} activeContexts
 * @param {types.OHIFStudy[]} studies
 * @returns {types.LeftRight<ButtonGroup[]>}
 */
export function getPanelButtonGroups(activeContexts, studies) {
    const { extensionManager } = getApp();
    const buttonGroups = {
        left: [],
        right: [],
    };

    /** @type {types.PanelModule[]} */
    const panelModules = extensionManager.modules[MODULE_TYPES.PANEL].map(ext => ext.module);
    panelModules.forEach(panelModule => {
        const defaultContexts = Array.from(panelModule.defaultContext);

        panelModule.menuOptions.forEach(menuOption => {
            const contexts = Array.from(menuOption.context || defaultContexts);
            const hasActiveContext = arrayUtils.hasIntersection(activeContexts, contexts);

            // It's a bit beefy to pass studies; probably only need to be reactive on `studyInstanceUIDs` and activeViewport?
            // Note: This does not cleanly handle `studies` prop updating with panel open
            const isDisabled = typeof menuOption.isDisabled === 'function' && menuOption.isDisabled(studies);

            if (hasActiveContext && !isDisabled) {
                /** @type {ButtonGroup} */
                const menuOptionEntry = {
                    value: menuOption.target,
                    icon: menuOption.icon,
                    bottomLabel: menuOption.label,
                };

                const side = menuOption.from || 'right';
                buttonGroups[side].push(menuOptionEntry);
            }
        });
    });

    return buttonGroups;
}

/**
 * Determine which extension buttons should be showing, if they're active, and what their onClick behavior should be.
 * @param {types.ToolbarButton[]} toolbarButtons
 * @param {types.ToolbarButton[]} activeButtons
 * @param {ButtonClickedCallback} onClickHandler
 */
export function getButtonComponents(toolbarButtons, activeButtons, onClickHandler) {
    const buttonComponents = toolbarButtons.map(button => {
        const hasCustomComponent = button.CustomComponent;
        const hasNestedButtonDefinitions = button.buttons && button.buttons.length;

        if (hasCustomComponent) {
            return getCustomButtonComponent(button, activeButtons, onClickHandler);
        }

        if (hasNestedButtonDefinitions) {
            return getExpandableButtonComponent(button, activeButtons, onClickHandler);
        }

        return getDefaultButtonComponent(button, activeButtons, onClickHandler);
    });

    return buttonComponents;
}

/**
 * Get CustomComponent for the button definition.
 * @param {types.ToolbarButton} button
 * @param {types.ToolbarButton[]} activeButtons
 * @param {ButtonClickedCallback} onClickHandler
 */
function getCustomButtonComponent(button, activeButtons, onClickHandler) {
    const { CustomComponent } = button;
    const isValidComponent = typeof CustomComponent === 'function';

    // Check if its a valid customComponent. Later on an CustomToolbarComponent interface could be implemented.
    if (isValidComponent) {
        const activeButtonsIds = activeButtons.map(button => button.id);
        const isActive = activeButtonsIds.includes(button.id);

        return (
            //@ts-ignore
            <CustomComponent
                id={button.id}
                toolbarClickCallback={() => { onClickHandler(button); }}
                button={button}
                tooltip={button.tooltip}
                key={button.id}
                activeButtons={activeButtonsIds}
                isActive={isActive}
            />
        );
    }
}

/**
 * Get the ExpandableToolMenu for the button definition.
 * @param {types.ToolbarButton} button
 * @param {types.ToolbarButton[]} activeButtons
 * @param {ButtonClickedCallback} onClickHandler
 */
function getExpandableButtonComponent(button, activeButtons, onClickHandler) {
    const activeButtonIds = activeButtons.map(b => b.id);
    let activeButtonId;
    const childButtons = button.buttons.map(childButton => {
        // Iterate over button definitions and update `onClick` behavior
        childButton.onClick = (evt, props) => { onClickHandler(childButton, evt, props); };

        if (activeButtonIds.includes(childButton.id)) {
            activeButtonId = childButton.id;
        }

        return childButton;
    });

    return (
        <ExpandableToolMenu
            key={button.id}
            id={button.id}
            label={button.label}
            icon={button.icon}
            tooltip={button.tooltip}
            buttons={childButtons}
            activeButtonId={activeButtonId}
        />
    )
}

/**
 * Get ToolbarButton for the button definition.
 * @param {types.ToolbarButton} button
 * @param {types.ToolbarButton[]} activeButtons
 * @param {ButtonClickedCallback} onClickHandler
 */
function getDefaultButtonComponent(button, activeButtons, onClickHandler) {
    const state = getState();
    const isDisabled = button.disableFunction ? button.disableFunction(state) : false;
    return (
        <ToolbarButton
            key={button.id}
            id={button.id}
            label={button.label}
            tooltip={button.tooltip}
            icon={button.icon}
            onClick={evt => onClickHandler(button, evt)}
            isActive={activeButtons.map(button => button.id).includes(button.id)}
            isDisabled={isDisabled}
        />
    )
}

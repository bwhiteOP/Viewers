/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 09, 2020 by Jay Liu
 */

import './ExpandableToolMenu.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {  Tooltip } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import ToolbarButton from './ToolbarButton';
import withTooltip from '../withTooltip';

function ExpandableToolMenu(props) {
    const [state, setState] = useState({ isExpanded: false });

    const activeButton = getActiveButton(props.buttons, props.activeButtonId);
    const isActive = activeButton !== undefined;
    const activeLabel = activeButton ? activeButton.label : props.label;

    const popoutOverlayButtonComponents = mapButtons(props.buttons, props.activeButtonId);

    function onOverlayHide() {
        setState({ isExpanded: false });
    }

    function onExpandableToolClick() {
        if (props.onGroupMenuClick) {
            props.onGroupMenuClick();
        }
        setState({ isExpanded: !state.isExpanded, });
    }

    return (
        <div/>
    );
}

/**
 * Maps button definition to ToolbarButton components.
 * @param {types.ToolbarButton[]} buttons
 * @param {string} activeButtonId
 * @returns {JSX.Element[]} the button components
 */
function mapButtons(buttons, activeButtonId) {
    return buttons.map((button, index) => {
        return (
            <ToolbarButton
                key={index}
                {...button}
                isActive={button.id === activeButtonId}
            />
        )
    });
}

/**
 * Gets the ToolbarButton that should be activated based on the activeButtonId.
 * @param {types.ToolbarButton[]} buttons
 * @param {string} activeButtonId
 * @returns {types.ToolbarButton} the active ToolbarButton
 */
function getActiveButton(buttons, activeButtonId) {
    return activeButtonId
        ? buttons.find(btn => activeButtonId === btn.id)
        : undefined;
}

ExpandableToolMenu.propTypes = {
    id: PropTypes.string.isRequired,
    /** Button label */
    label: PropTypes.string.isRequired,
    /** Array of buttons to render when expanded */
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string.isRequired,
            icon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                }),
            ]),
        })
    ).isRequired,
    icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
    ]),
    tooltip: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
    }),
    onGroupMenuClick: PropTypes.func,
    activeButtonId: PropTypes.string,
};

ExpandableToolMenu.defaultProps = {
    buttons: [],
    icon: 'ellipse-circle',
    label: 'More',
};

export default withTooltip(ExpandableToolMenu);

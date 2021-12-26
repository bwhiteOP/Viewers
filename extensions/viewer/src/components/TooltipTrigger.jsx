/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 09, 2020 by Jay Liu
 */

import './TooltipTrigger.styl';
import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from '@ohif/ui';
import { publicSettings } from '@onepacs/core';

function TooltipTrigger(props) {
    const { tooltip, placement, children } = props;

    if (tooltip === undefined) {
        // Nothing to do, return original children
        return children;
    }

    const cachedSettings = publicSettings.cached();
    return (
        <OverlayTrigger
            placement={placement}
            delay={cachedSettings.ui.toolbarTooltipDelay.show || 1500}
            delayHide={cachedSettings.ui.toolbarTooltipDelay.hide || 0}
            overlay={getTooltipOverlay(props.tooltip, placement)}
        >
            {children}
        </OverlayTrigger>
    )
}

function getTooltipOverlay(tooltip, placement) {
    return (
        <Tooltip
            id={`${Math.random()}-tooltip-trigger}`}
            className="tooltip-trigger"
            placement={placement}
        >
            <div className='title'>{tooltip.title}</div>
            <div className='description'>{tooltip.description}</div>
        </Tooltip>
    )
}

const triggerType = PropTypes.oneOf(['click', 'hover', 'focus']);

TooltipTrigger.propTypes = {
    children: PropTypes.node.isRequired,
    placement: PropTypes.string,
    trigger: PropTypes.oneOfType([triggerType, PropTypes.arrayOf(triggerType)]),
    tooltip: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
    })
};

TooltipTrigger.defaultProps = {
    placement: 'bottom',
    trigger: ['hover', 'focus'],
};

export default TooltipTrigger;

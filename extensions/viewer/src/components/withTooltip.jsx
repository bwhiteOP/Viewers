/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 09, 2020 by Jay Liu
 */

import React from 'react';
import PropTypes from 'prop-types';
import TooltipTrigger from './TooltipTrigger';

/**
 * High Order Component to attach mouse event handlers to inner component and show tooltip.
 * @param {*} Component
 */
function withTooltip(Component) {
    const TooltipComponent = function(props) {
        return (
            <TooltipTrigger tooltip={props.tooltip}>
                <Component {...props} />
            </TooltipTrigger>
        )
    }

    TooltipComponent.propTypes = {
        ...Component.propTypes,
        tooltip: PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
        })
    }

    return TooltipComponent;
}

export default withTooltip;

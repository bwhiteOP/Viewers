/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 09, 2020 by Jay Liu
 */

import './ToolbarButton.styl';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Icon } from '../Icon';
import withTooltip from '../withTooltip';


export function ToolbarButton(props) {
    const { isActive, isDisabled, icon, labelWhenActive } = props;
    const { t } = useTranslation('Buttons');
    const className = classnames(props.className, { active: isActive, disabled: isDisabled });
    const iconProps = typeof icon === 'string' ? { name: icon } : icon;
    const label = isActive && labelWhenActive ? labelWhenActive : props.label;

    const arrowIconName = props.isExpanded ? 'caret-up' : 'caret-down';
    const arrowIcon = props.isExpandable && (
        <Icon name={arrowIconName} className="expand-caret" />
    );

    const onMouseEvent = function (eventMethod, event) {
        props[eventMethod] && props[eventMethod](event, props);
    }
    const handleClick = function (evt) {
        !isDisabled && props.onClick(evt);
    }
    const handleMouseOut = onMouseEvent.bind(this, 'onMouseOut');
    const handleMouseOver = onMouseEvent.bind(this, 'onMouseOver');

    return (
        <div
            id={props.id}
            className={className}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            {iconProps && <div className="toolbar-button-svgContainer"><Icon {...iconProps} /></div>}
            <div className="toolbar-button-label">
                {t(label)}
                {arrowIcon}
            </div>
        </div>
    );
}

ToolbarButton.propTypes = {
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isDisabled: PropTypes.bool,
    /** Display label for button */
    label: PropTypes.string.isRequired,
    /** Alternative text to show when button is active */
    labelWhenActive: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
    ]),
    onClick: PropTypes.func,
    /** Determines if we show expandable 'caret' symbol */
    isExpandable: PropTypes.bool,
    /** Direction of expandable 'caret' symbol */
    isExpanded: PropTypes.bool,
};

ToolbarButton.defaultProps = {
    isActive: false,
    className: 'toolbar-button',
};


export default withTooltip(ToolbarButton);

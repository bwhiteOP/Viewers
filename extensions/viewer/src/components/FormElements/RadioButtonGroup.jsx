/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 05, 2020 by Jay Liu
 */

import './RadioButtonGroup.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * @typedef {Object} RadioButtonOption
 * @prop {string} label
 * @prop {*} value
 * @prop {boolean} checked
 */

/** * @param {{ options: RadioButtonOption[], selected: any, onChange: Function}} */
export function RadioButtonGroup({ options, selected, onChange}) {
    const [state, setState] = useState(options.find(x => x.value === selected)?.value || selected || options[0].value);

    /**
     * @param {React.ChangeEvent<HTMLInputElement>} event
     * @param {RadioButtonOption} option
     */
    function handleInputChange(event, option) {
        setState(option.value);
        onChange(option.value);
    }

    /**
     * @param {RadioButtonOption} option
     * @param {number} index
     */
    function renderRadioButton(option, index) {
        const isSelected = option.value === state;
        const radioButtonLabelClassName = classnames('radio-button', { 'selected': isSelected });
        return (
            <label key={index} className={radioButtonLabelClassName}>
                <input
                    type="radio"
                    className="radio-button-input"
                    checked={isSelected}
                    onChange={event => handleInputChange(event, option)}
                />
                <span className="wrapperText">{option.label}</span>
            </label>
        )
    }

    return (
        <div className="RadioButtonGroup">
            {options.map(renderRadioButton)}
        </div>
    )
}

RadioButtonGroup.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
        })
    ),
    selected: PropTypes.any,
    onChange: PropTypes.func.isRequired
};

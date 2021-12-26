/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 05, 2020 by Jay Liu
 */

import './Checkbox.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function Checkbox({ label, checked, onChange}) {
    const [state, setState] = useState(checked);

    /** @param {React.ChangeEvent<HTMLInputElement>} event  */
    function handleInputChange(event) {
        setState(event.target.checked);
        onChange(event.target.checked);
    }

    return (
        <div className="Checkbox">
            <label className="checkbox-label">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={state}
                    onChange={handleInputChange}
                />
                {label}
            </label>
        </div>
    )
}

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

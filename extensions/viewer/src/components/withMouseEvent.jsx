/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 13, 2020 by Jay Liu
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * High Order Component to attach mouse event handlers to inner component.
 * @param {*} Component
 */
export function withMouseEvent(Component) {
    const MouseEventComponent = function(props) {
        return (
            <div id={props.id}
                className="with-mouseEvent"
                onMouseOver={props.onMouseOver}
                onMouseOut={props.onMouseOut}
            >
                <Component {...props} />
            </div>
        )
    }

    MouseEventComponent.propTypes = {
        id: PropTypes.string,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
    };

    return MouseEventComponent;
}

export default withMouseEvent;

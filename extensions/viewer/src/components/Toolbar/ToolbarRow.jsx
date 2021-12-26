/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 08, 2020 by Jay Liu
 */

import './ToolbarRow.styl';
// @ts-ignore
import React from 'react';
import PropTypes from 'prop-types';
import { RoundedButtonGroup } from '@ohif/ui';
import {
    getButtonComponents,
    runCommand,
} from './ToolbarRowHelpers';
import { useToolbarButtons } from './useToolbarButtons';
import { usePanelButtonGroups } from './usePanelButtonGroups';
import { Logo } from '../Logo';

export function ToolbarRow(props) {
    const { studies } = props;

    const {
        toolbarRowRef,
        displayedButtons,
        activeButtons,
        setButtonActive,
        toggleCineButton,
    } = useToolbarButtons();

    const {
        left: leftButtonGroup,
        right: rightButtonGroup
    } = usePanelButtonGroups(studies);

    /** @type {import('./ToolbarRowHelpers').ButtonClickedCallback} */
    function handleToolbarButtonClick(button, evt = undefined, props = {}) {
        if (button.commandName) {
            const options = Object.assign({ evt }, button.commandOptions);
            runCommand(button.commandName, options);
        }

        if (button.type === 'setToolActive') {
            setButtonActive(button);
        } else if (button.type === 'builtIn' && button.options.behavior === 'CINE') {
            toggleCineButton(button);
        }
    }

    const buttonComponents = getButtonComponents(displayedButtons, activeButtons, handleToolbarButtonClick)

    return (
        <div className="onepacs ToolbarRow" ref={toolbarRowRef}>
            <Logo />

            <div className="leftButtonGroup">
                <RoundedButtonGroup
                    options={leftButtonGroup}
                    value={props.selectedLeftPanel || ''}
                    onValueChanged={props.selectLeftPanel}
                />
            </div>

            <div className="toolbarButtonsContainer">
                {buttonComponents}
            </div>

            <div className="rightButtonGroup" >
                {rightButtonGroup.length && (
                    <RoundedButtonGroup
                        options={rightButtonGroup}
                        value={props.selectedRightPanel || ''}
                        onValueChanged={props.selectRightPanel}
                    />
                )}
            </div>
        </div>
    )
}

// TODO: Simplify these? isOpen can be computed if we say "any" value for selected,
// closed if selected is null/undefined
ToolbarRow.propTypes = {
    isLeftPanelOpen: PropTypes.bool.isRequired,
    isRightPanelOpen: PropTypes.bool.isRequired,
    selectedLeftPanel: PropTypes.string,
    selectedRightPanel: PropTypes.string,
    selectLeftPanel: PropTypes.func.isRequired,
    selectRightPanel: PropTypes.func.isRequired,
    studies: PropTypes.array,
};

ToolbarRow.defaultProps = {
    studies: [],
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

import './WindowLevelPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TabFooter, useSnackbarContext } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUserPreferences } from '../../../hooks/user';
import { WindowLevelRow } from './WindowLevelRow';

export function WindowLevelPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('wlPresets');

    // local component states
    /** @type {types.useState<types.WLPresetsPreferences>} */
    const [state, setState] = useState(preferences);

    async function onSavePreferences() {
        try {
            /** @type {types.WLPresetsPreferences} */
            const newPreferences = state;

            await savePreferences(newPreferences);
            snackbar.show({
                type: 'success',
                message: 'Window/Levels Presets preferences saved.',
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'Window/Levels Presets preferences failed to save successfully.',
            });
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
            snackbar.show({
                type: 'success',
                message: 'Window/Levels Presets preferences reset.'
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'Window/Levels Presets preferences failed to reset successfully.',
            });
        }
    }

    /**
     * @param {string} rowKey
     * @param {types.WLPreset} wlPreset
     */
    function replacePreset(rowKey, wlPreset) {
        state[rowKey] = wlPreset;
        const newState = { ...state, [rowKey]: wlPreset };
        setState(newState);
    }

    return (
        <React.Fragment>
            <div className="WindowLevelPreferences">
                <div className="wlColumn">
                    <div className="wlRow header">
                        <div className="wlColumn preset">Preset</div>
                        <div className="wlColumn description">Description</div>
                        <div className="wlColumn window">Window</div>
                        <div className="wlColumn level">Level</div>
                    </div>
                    {Object.keys(state).map(key => (
                        <WindowLevelRow
                            key={key}
                            rowKey={key}
                            wlPreset={state[key]}
                            onChanged={replacePreset}
                        />
                    ))}
                </div>
            </div>
            <TabFooter
                onResetPreferences={_ => onResetPreferences()}
                onSave={_ => onSavePreferences()}
                onCancel={onClose}
                hasErrors={false}
                t={t}
            />
        </React.Fragment>
    );
}

WindowLevelPreferences.propTypes = {
    onClose: PropTypes.func,
};

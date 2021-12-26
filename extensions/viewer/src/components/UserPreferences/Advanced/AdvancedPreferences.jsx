/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 10, 2020 by Jay Liu
 */

import './AdvancedPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TabFooter, useSnackbarContext } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUser, useUserPreferences } from '../../../hooks/user';
import { Checkbox } from '../../FormElements';

export function AdvancedPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('advanced');
    const [user] = useUser();

    // local component states
    /** @type {types.useState<types.AdvancedPreferences>} */
    const [state, setState] = useState(preferences);

    async function onSavePreferences() {
        try {
            /** @type {types.AdvancedPreferences} */
            const newPreferences = state;

            await savePreferences(newPreferences);
            snackbar.show({
                type: 'success',
                message: 'Advanced preferences saved.',
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'Advanced preferences failed to save successfully.',
            });
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
            snackbar.show({
                type: 'success',
                message: 'Advanced preferences reset.'
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'Advanced preferences failed to reset successfully.',
            });
        }
    }

    function renderCheckbox(key, label, permitted) {
        return (
            <div key={key} className='advancedRow'>
                {permitted
                    ? <Checkbox
                        label={label}
                        checked={state[key]}
                        onChange={value => setState({...state, [key]: value })}
                    ></Checkbox>
                    : <div></div>
                }
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="AdvancedPreferences">
                <div className="advancedColumn">
                    {[
                        renderCheckbox('BandwidthSavingModeEnabled', 'Bandwidth saving mode (not for diagnostic use)', user.permissions.allowFullDICOM),
                        renderCheckbox('WebGLEnabled', 'Use WebGL for image rendering', true),
                        renderCheckbox('PathologyEnabled', 'Pathology classification (restart required)', user.permissions.allowPathologyClassification),
                    ]}
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

AdvancedPreferences.propTypes = {
    onClose: PropTypes.func,
};

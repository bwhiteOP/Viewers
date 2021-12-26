/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 10, 2020 by Jay Liu
 */

import './SuvPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TabFooter, useSnackbarContext } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUserPreferences } from '../../../hooks/user';
import { Checkbox } from '../../FormElements';

export function SuvPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('suv');

    // local component states
    /** @type {types.useState<types.SuvPreferences>} */
    const [state, setState] = useState(preferences);

    async function onSavePreferences() {
        try {
            /** @type {types.SuvPreferences} */
            const newPreferences = state;

            await savePreferences(newPreferences);
            snackbar.show({
                type: 'success',
                message: 'SUV preferences saved.',
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'SUV preferences failed to save successfully.',
            });
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
            snackbar.show({
                type: 'success',
                message: 'SUV preferences reset.'
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'SUV preferences failed to reset successfully.',
            });
        }
    }

    function renderCheckbox(key, label) {
        return (
            <div key={key} className='suvRow'>
                <Checkbox
                    label={label}
                    checked={state[key]}
                    onChange={value => setState({...state, [key]: value })}
                ></Checkbox>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="SuvPreferences">
                <div className="suvTitle">Calculate Standard Update Values (SUV) using the following criteria:</div>
                <div className="suvColumn">
                    {[
                        renderCheckbox('SuvBwEnabled', 'Body Weight (SUV bw)'),
                        renderCheckbox('SuvBsaEnabled', 'Body Surface Area (SUV bsa)'),
                        renderCheckbox('SuvLbmEnabled', 'Lean Body Mass (SUV lbm)'),
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

SuvPreferences.propTypes = {
    onClose: PropTypes.func,
};

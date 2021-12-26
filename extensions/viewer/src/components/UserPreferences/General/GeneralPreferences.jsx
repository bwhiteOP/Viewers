/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 05, 2020 by Jay Liu
 */

import './GeneralPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TabFooter, useSnackbarContext } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUserPreferences } from '../../../hooks/user';
import { Checkbox, RadioButtonGroup } from '../../FormElements';

export function GeneralPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('general');

    // local component states
    /** @type {types.useState<types.GeneralPreferences>} */
    const [state, setState] = useState(preferences);

    async function onSavePreferences() {
        try {
            /** @type {types.GeneralPreferences} */
            const newPreferences = state;

            await savePreferences(newPreferences);
            snackbar.show({
                type: 'success',
                message: 'General preferences saved.',
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'General preferences failed to save successfully.',
            });
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
            snackbar.show({
                type: 'success',
                message: 'General preferences reset.'
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'General preferences failed to reset successfully.',
            });
        }
    }

    function renderCheckbox(key, label) {
        return (
            <div key={key} className='generalRow'>
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
            <div className="GeneralPreferences">
                <div className="generalColumn">
                    {[
                        renderCheckbox('ScaleOverlayEnabled', 'Show scale overlay by default'),
                        renderCheckbox('MultiframeAutoPlayCineEnabled', 'Automatically start cine clip when opening a multi-frame study'),
                    ]}
                    <div className='measurement-precision-section'>
                        <span>Decimal precision (scale) for measurements:</span>
                        <RadioButtonGroup
                            options={[
                                { label: '1 (eg, 5.1 cm, 2.1 mm)', value: 1 },
                                { label: '2 (eg, 5.14 cm, 2.13 mm)', value: 2 }
                            ]}
                            selected={state.MeasurementPrecision}
                            onChange={value => setState({...state, MeasurementPrecision: value })}
                        ></RadioButtonGroup>
                    </div>
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

GeneralPreferences.propTypes = {
    onClose: PropTypes.func,
};

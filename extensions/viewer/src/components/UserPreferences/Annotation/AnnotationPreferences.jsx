/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 04, 2020 by Jay Liu
 */

import './AnnotationPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TextInput, TabFooter, useSnackbarContext } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUserPreferences } from '../../../hooks/user';

const range = { min: 50, max: 1000 };

export function AnnotationPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('annotation');

    // local component states
    const [fontScale, setFontScale] = useState(preferences.FontSizeScale || 100);

    async function onSavePreferences() {
        try {
            /** @type {types.AnnotationPreferences} */
            const newPreferences = {
                FontSizeScale: fontScale
            };

            await savePreferences(newPreferences);
            snackbar.show({
                type: 'success',
                message: 'Annotation preferences saved.',
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'Annotation preferences failed to save successfully.',
            });
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
            snackbar.show({
                type: 'success',
                message: 'Annotation preferences reset.'
            });
        } catch (error) {
            snackbar.show({
                type: 'error',
                message: 'Annotation preferences failed to reset successfully.',
            });
        }
    }

    return (
        <React.Fragment>
            <div className="AnnotationPreferences">
                <TextInput className="preferencesInput"
                    type="number" min={range.min} max={range.max}
                    label="Font sale of the text annotation (%)"
                    value={fontScale}
                    onChange={event => setFontScale(parseInt(event.target.value))}
                />

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

AnnotationPreferences.propTypes = {
    onClose: PropTypes.func,
};

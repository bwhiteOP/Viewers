/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 02, 2020 by Jay Liu
 */

import './LayoutPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
//import { useSnackbarContext } from '@ohif/ui';
import {TabFooter} from "../../tabComponents";

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUserPreferences } from '../../../hooks/user';
import { LayoutRow } from './LayoutRow';

export function LayoutPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    //const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('layout');

    // local component states
    const [layouts, setLayouts] = useState(preferences);

    async function onSavePreferences() {
        try {
            /** @type {types.LayoutPreferences} */
            const newPreferences = layouts;

            await savePreferences(newPreferences);
          /*  snackbar.show({
                message: 'Layout preferences saved.',
                type: 'success',
            });*/
        } catch (error) {
          /*  snackbar.show({
                message: 'Layout preferences failed to save successfully.',
                type: 'error',
            });*/
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
          /*  snackbar.show({
                message: 'Layout preferences reset.',
                type: 'success',
            });*/
        } catch (error) {
           /* snackbar.show({
                message: 'Layout preferences failed to reset successfully.',
                type: 'error',
            });*/
        }
    }

    /** @param {types.Layout} layout */
    function replaceLayout(layout) {
        const index = layouts.findIndex(l => l.modality === layout.modality);
        const newLayouts = layouts.slice();
        newLayouts.splice(index, 1, layout);
        setLayouts(newLayouts);
    }

    return (
        <React.Fragment>
            <div className="LayoutPreferences">
                <div className="layoutColumn">
                    <div className="layoutRow header">
                        <div className="layoutColumn modality">Modality</div>
                        <div className="layoutColumn rows">Rows</div>
                        <div className="layoutColumn columns">Columns</div>
                    </div>
                    <div className="overflow-container">
                        <div className="overflow-content">
                            {layouts.map(l => (
                                <LayoutRow
                                    key={l.modality}
                                    layout={l}
                                    onChanged={replaceLayout}
                                />
                            ))}
                        </div>
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

LayoutPreferences.propTypes = {
    onClose: PropTypes.func,
};

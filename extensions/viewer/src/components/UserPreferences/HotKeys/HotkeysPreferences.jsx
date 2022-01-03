/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

import './HotkeysPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
//import { useSnackbarContext } from '@ohif/ui';
import { TabFooter} from "../../tabComponents";

// eslint-disable-next-line no-unused-vars
import { types, arrayUtils } from '@onepacs/core';
import { HotkeyColumn } from './HotkeysColumn';
import { validateCommandKey } from './hotkeysValidators';
import { useHotkeys } from '../../../hooks';

export function HotkeysPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    //const snackbar = useSnackbarContext();
    const [hotkeyDefinitions, hotkeyDefaults, saveHotkeys] = useHotkeys();

    // local component states
    const [hotkeys, setHotkeys] = useState(hotkeyDefinitions);
    /** @type {types.useState<types.Dictionary<string>>} */
    const [errors, setErrors] = useState({});

    async function onSavePreferences() {
        try {
            await saveHotkeys(hotkeys);

           /* snackbar.show({
                message: 'Keyboard shortcuts preferences saved.',
                type: 'success',
            });*/
        } catch (error) {
          /*  snackbar.show({
                message: 'Keyboard shortcuts preferences failed to save successfully.',
                type: 'error',
            });*/
        }
    }

    async function onResetPreferences() {
        try {
            await saveHotkeys(convertToDictionary(hotkeyDefaults));
           /* snackbar.show({
                message: 'Keyboard shortcuts preferences reset.',
                type: 'success',
            });*/
        } catch (error) {
         /*   snackbar.show({
                message: 'Keyboard shortcuts preferences failed to reset successfully.',
                type: 'error',
            });*/
        }
    }

    /** @type {import('./HotkeyRow').HotkeyChanged} */
    function onHotkeyChanged(commandName, hotkeyDefinition, newKeys) {
        const { hasError, errorMessage } = validateCommandKey({
            commandName,
            pressedKeys: newKeys,
            hotkeys: hotkeys,
        });

        const newHotkeys = { ...hotkeys, [commandName]: { ...hotkeyDefinition, keys: newKeys }};
        setHotkeys(newHotkeys);
        setErrors({ ...errors, [commandName]: hasError ? errorMessage : undefined });
    }

    const hasErrors = Object.keys(errors).some(key => !!errors[key]);
    const hasHotkeys = Object.keys(hotkeys).length;
    const splitedHotkeys = arrayUtils.splitInHalf(Object.entries(hotkeys));

    return (
        <React.Fragment>
            <div className="HotkeysPreferences">
                {hasHotkeys ? (
                    <div className="overflow-container">
                        <div className="overflow-content">
                            <div className="hotkeyTable">
                                {splitedHotkeys.map((hotkeys, index) => (
                                    <HotkeyColumn key={index} hotkeys={hotkeys} errors={errors} onChanged={onHotkeyChanged} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    'Hotkeys definitions is empty'
                )}
            </div>
            <TabFooter
                onResetPreferences={_ => onResetPreferences()}
                onSave={_ => onSavePreferences()}
                onCancel={onClose}
                hasErrors={hasErrors}
                t={t}
            />
        </React.Fragment>
    );
}

HotkeysPreferences.propTypes = {
    onClose: PropTypes.func,
};


/**
 * @param {types.HotkeyCommand[]} hotkeys
 * @returns {types.HotkeyDictionary}
 */
function convertToDictionary(hotkeys) {
    /** @type {types.HotkeyDictionary} */
    const hotkeyDictionary = {};

    hotkeys.map(item => {
        const { commandName, ...values } = item;
        hotkeyDictionary[commandName] = { ...values };
    })

    return hotkeyDictionary;
}

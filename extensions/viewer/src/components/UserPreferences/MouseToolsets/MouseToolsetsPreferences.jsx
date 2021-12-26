/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

import './MouseToolsetsPreferences.styl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useTranslation } from 'react-i18next';
import { TabFooter, useSnackbarContext } from '@ohif/ui';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useUserPreferences } from '../../../hooks/user';
import { MouseToolsetRow } from './MouseToolsetRow';

/**
 * @typedef {import ('./MouseToolsetRow').ToolsetRow} ToolsetRow
 */

export function MouseToolsetsPreferences({ onClose }) {
    const { t } = useTranslation('UserPreferencesModal');
    const snackbar = useSnackbarContext();
    const [preferences, defaultPreferences, savePreferences] = useUserPreferences('mouseToolsets');

    // local component states
    const [toolsetRows, setToolsetRows] = useState(preferences.toolsets.map(createRow));
    const [nextId, setNextId] = useState(toolsetRows.length);

    async function onSavePreferences() {
        try {
            /** @type {types.MouseToolsetsPreferences} */
            const newPreferences = {
                activeIndex: 0,
                toolsets: toolsetRows.map(r => r.value)
            };

            await savePreferences(newPreferences);
            snackbar.show({
                message: 'Mouse toolsets preferences saved.',
                type: 'success',
            });
        } catch (error) {
            snackbar.show({
                message: 'Mouse toolsets preferences failed to save successfully.',
                type: 'error',
            });
        }
    }

    async function onResetPreferences() {
        try {
            await savePreferences(defaultPreferences);
            snackbar.show({
                message: 'Mouse toolsets preferences reset.',
                type: 'success',
            });
            onClose();
        } catch (error) {
            snackbar.show({
                message: 'Mouse toolsets preferences failed to reset successfully.',
                type: 'error',
            });
        }
    }

    /** @param {number} _id unused because we are always appending */
    function appendRow(_id) {
        const rows = toolsetRows.slice();
        const newRow = createRow(defaultPreferences.toolsets[0], nextId);
        rows.push(newRow);
        setToolsetRows(rows);
        setNextId(nextId + 1);
    }

    /** @param {number} id */
    function removeRow(id) {
        const rows = toolsetRows.slice();
        const index = toolsetRows.findIndex(r => r.id === id);
        rows.splice(index, 1);
        setToolsetRows(rows);
    }

    /** @param {ToolsetRow} row */
    function updateRow(row) {
        const rows = toolsetRows.slice();
        const index = toolsetRows.findIndex(r => r.id === row.id);
        rows.splice(index, 1, row);
        setToolsetRows(rows);
    }

    return (
        <React.Fragment>
            <div className="MouseToolsetsPreferences">
                <div className="toolsetColumn">

                    <div className="toolsetRow header">
                        <div className="toolsetColumn left">Left</div>
                        <div className="toolsetColumn middle">Middle</div>
                        <div className="toolsetColumn right">Right</div>
                        <div className="toolsetColumn button">{/* For button */}</div>
                    </div>
                    {toolsetRows.map(r => (
                        <MouseToolsetRow
                            key={r.id}
                            row={r}
                            onPlusClicked={appendRow}
                            onMinusClicked={removeRow}
                            onChanged={updateRow}
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

/**
 * @param {types.MouseToolset} toolset
 * @param {number} id
 * @returns {ToolsetRow}
 */
function createRow(toolset, id) {
    return { id, value: _.cloneDeep(toolset) };
}

MouseToolsetsPreferences.propTypes = {
    onClose: PropTypes.func,
};

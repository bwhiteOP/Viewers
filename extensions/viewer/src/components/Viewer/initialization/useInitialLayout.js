/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

// @ts-ignore
import OHIF from '@ohif/core';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { reduxUserPreferences } from '@onepacs/user';

const { setLayout } = OHIF.redux.actions;
const { isUserPreferencesFirstLoaded, getPreferences } = reduxUserPreferences.selectors;

/**
 * Set initial layout based on the modality in the study.
 * TODO: initial layout should be implemented using Hanging Protocols default strategy
 * @param {types.OHIFStudy[]} studies
 */
export function useInitialLayout(studies) {
    const dispatch = useDispatch();
    const isLoadedFirstTime = useSelector(isUserPreferencesFirstLoaded);

    /** @type {types.LayoutPreferences} */
    const layoutPreferences = useSelector(state => getPreferences(state, 'layout'));

    const modality = studies[0]?.displaySets[0]?.Modality || '';

    useEffect(() => {
        if (isLoadedFirstTime && layoutPreferences) {
            const layout = getLayoutForModality(layoutPreferences, modality);
            dispatch(setLayout(layout));
        }
    }, [dispatch, modality, isLoadedFirstTime, layoutPreferences]);
}

/**
 * Get the layout preferences for a specified modality.
 * @param {types.LayoutPreferences} layoutPreferences
 * @param {string} modality
 * @returns {Object} the layout object expected by SET_VIEWPORT_LAYOUT redux action.
 */
function getLayoutForModality(layoutPreferences, modality) {
    const layout = layoutPreferences.find(x => x.modality.toLowerCase() === modality.toLowerCase());
    const numRows = layout?.rows || 1;
    const numColumns = layout?.columns || 1;
    const viewports = new Array(numRows * numColumns).fill({});
    return { numRows, numColumns, viewports };
}

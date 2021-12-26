/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 10, 2020 by Jay Liu
 */

// @ts-ignore
import OHIF from '@ohif/core';
import { useSelector, useDispatch } from 'react-redux';
import { getStudies } from '../redux/selectors/studies';

const { setStudyData: setStudyDataAction } = OHIF.redux.actions;

/**
 * A custom hook that get/set the studyData in OHIF 'studies' redux store.
 * @returns {[
 *      *,
 *      function(string, *): void
 * ]}
 */
export function useStudyData() {
    const { studyData } = useSelector(getStudies);
    const dispatch = useDispatch();

    /**
     * @param {string} id
     * @param {*} data
     */
    function setStudyData(id, data) {
        dispatch(setStudyDataAction(id, data));
    }

    return [
        studyData,
        setStudyData
    ];
}

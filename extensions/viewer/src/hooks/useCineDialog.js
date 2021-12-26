/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 18, 2020 by Jay Liu
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { utils } from '@ohif/core';
import { useDialog } from '@ohif/ui';

import { toggleCineDialog } from '../redux/actions';
import { getCineDialogVisible } from '../redux/selectors/extensions';
import { CineDialog  } from '../components/CineDialog';

const CineDialogId = utils.guid();

/**
 * A custom hook that controls the visibility of the CineDialog.
 * @returns {[
 *      boolean,
 *      () => void
 * ]}
 */
export function useCineDialog() {
    const dialogService = useDialog();
    const dispatch = useDispatch();
    const visible = useSelector(getCineDialogVisible);

    useEffect(() => {
        if (visible) {
            createNewCineDialog(dialogService);
        } else if (visible === false) {
            dialogService.dismiss({ id: CineDialogId });
        }
    // Do NOT add dialogService to the list of dependencies.
    // It will lead to infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    function toggle() {
        dispatch(toggleCineDialog());
    }

    return [
        visible,
        toggle
    ];
}

/**
 * Create a new dialog and returns the tracking Id.
 * @param {*} dialogService
 * @param {*} contentProps
 * @returns {string} dialogId
 */
function createNewCineDialog(dialogService, contentProps = {}) {
    const spacing = 20;
    const { x, y } = document.querySelector('.ViewerMain').getBoundingClientRect();
    return dialogService.create({
        id: CineDialogId,
        content: CineDialog,
        contentProps,
        defaultPosition: {
            x: x + spacing || 0,
            y: y + spacing || 0,
        },
    });
}

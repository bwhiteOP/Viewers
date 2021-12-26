/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 19, 2020 by Jay Liu
 */

// Modified heavily from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/platform/viewer/src/connectedComponents/ConnectedCineDialog.js
import './CineDialog.styl';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cornerstoneTools from 'cornerstone-tools';

import { CineDialog as OhifCineDialog } from '@ohif/ui';

import { getApp } from '../../ohif';
import { Icon } from '../Icon';
import { useMountUnmount } from '../../hooks';
import { setCine, stopAllCine, setCineDialogVisible } from '../../redux/actions';
import { getCine } from '../../redux/selectors/viewports';
import { canNavigateNextDisplaySet, canNavigatePreviousDisplaySet } from '../../redux/selectors/navigation';
import { getStackData, getElement } from '../../utils';

const { commandsManager } = getApp();
const scrollToIndex = cornerstoneTools.import('util/scrollToIndex');

/**
 * OnePacs customized CineDialog
 */
export function CineDialog({ onClose }) {
    const { t } = useTranslation('Common');
    const dispatch = useDispatch();

    const canNavigatePrevious = useSelector(canNavigatePreviousDisplaySet);
    const canNavigateNext = useSelector(canNavigateNextDisplaySet);
    const canNavigate = canNavigatePrevious || canNavigateNext;

    let cine = useSelector(getCine) || {};

    useMountUnmount(
        undefined,
        // Stop clip when dialog closes.
        () => dispatch(stopAllCine())
    );

    function onPlayPauseChanged(isPlaying) {
        dispatch(setCine({ isPlaying }));
    }

    function onFrameRateChanged(cineFrameRate) {
        dispatch(setCine({ cineFrameRate }));
    }

    function handleCloseClick() {
        dispatch(setCineDialogVisible(false));
        onClose && onClose();
    }

    return (
        <div className="OnePacsCineDialog">
            <div className="OHIFModal__header">
                <span>{t('CINE')}</span>
                <button className="close-button" onClick={handleCloseClick}>×</button>
            </div>
            { canNavigate ?
                <div className="btn-group navigation">
                    <button
                        title={t('Previous display set')}
                        className="btn"
                        disabled={!canNavigatePrevious}
                        onClick={onClickPreviousDisplaySet}
                    >
                        <Icon name="caret-up" />
                    </button>
                    <button
                        title={t('Next display set')}
                        className="btn"
                        disabled={!canNavigateNext}
                        onClick={onClickNextDisplaySet}
                    >
                        <Icon name="caret-down" />
                    </button>
                </div>
                : <></>
            }
            <OhifCineDialog
                isPlaying={cine.isPlaying}
                cineFrameRate={cine.cineFrameRate}
                onPlayPauseChanged={onPlayPauseChanged}
                onFrameRateChanged={onFrameRateChanged}
                onClickNextButton={onClickNextButton}
                onClickBackButton={onClickBackButton}
                onClickSkipToStart={onClickSkipToStart}
                onClickSkipToEnd={onClickSkipToEnd}
            />
        </div>
    )
}

CineDialog.propTypes = {
    onClose: PropTypes.func,
}

function onClickNextButton() {
    const activeElement = getElement();
    const stackData = getStackData(activeElement);
    if (stackData) {
        const { currentImageIdIndex, imageIds } = stackData;
        if (currentImageIdIndex >= imageIds.length - 1) return;
        scrollToIndex(activeElement, currentImageIdIndex + 1);
    }
}

function onClickBackButton() {
    const activeElement = getElement();
    const stackData = getStackData(activeElement);
    if (stackData) {
        const { currentImageIdIndex } = stackData;
        if (currentImageIdIndex === 0) return;
        scrollToIndex(activeElement, currentImageIdIndex - 1);
    }
}

function onClickSkipToStart() {
    const activeEnabledElement = getEnabledElement();
    const stackData = getStackData(activeEnabledElement);
    if (stackData) {
        scrollToIndex(activeEnabledElement, 0);
    }
}

function onClickSkipToEnd() {
    const activeEnabledElement = getEnabledElement();
    const stackData = getStackData(activeEnabledElement);
    if (stackData) {
        const { imageIds } = stackData;
        const lastIndex = imageIds.length - 1;
        scrollToIndex(activeEnabledElement, lastIndex);
    }
}

function onClickPreviousDisplaySet() {
    commandsManager.runCommand('previousViewportDisplaySet');
}

function onClickNextDisplaySet() {
    commandsManager.runCommand('nextViewportDisplaySet');
}

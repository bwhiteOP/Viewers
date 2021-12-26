/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 28, 2021 by PoyangLiu
 */

import './StudyInfo.styl';
import React from 'react';
import { formatDA, formatTM } from '../../utils';

/* eslint-disable react/prop-types */
/** @typedef {import('./useStudyThumbnails').StudyThumbnails} StudyThumbnails */

/**
 * @param {{
 *  item: StudyThumbnails,
 *  onClick: (item: StudyThumbnails) => void
 * }} props 
 */
export function StudyInfo({ item, onClick }) {
    const modalities = formatModalities(item.Modalities);
    return (
        <div className="study-info">
            <div className="study-modality" onClick={() => onClick(item)}>
                <div className="study-modality-box">
                    <div className="study-modality-text" >
                        {modalities}
                    </div>
                </div>
                <div className="study-text">
                    <div className="study-date">{formatDA(item.StudyDate)} {formatTM(item.StudyTime)}</div>
                    <div className="study-description">{item.StudyDescription}</div>
                </div>
            </div>
        </div>
    );
}

/**
 * @param {string[]} modalities 
 */
function formatModalities(modalities) {
    if (!modalities || modalities.length === 0) {
        return 'UN';
    }

    // Show only the first 3 modalities if there are more
    let modlitiesText = modalities.slice(0, 3).join(', ');
    if (modalities.length > 3) {
        modlitiesText += '...';
    }

    return modlitiesText;
}

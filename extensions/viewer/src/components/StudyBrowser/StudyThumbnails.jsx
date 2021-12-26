/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 04, 2021 by PoyangLiu
 */

import './StudyThumbnails.styl';
import React from 'react';
import classnames from 'classnames';
import { StudyInfo } from './StudyInfo';
import { SeriesThumbnails } from './SeriesThumbnails';

/* eslint-disable react/prop-types */
/** @typedef {import('./useStudyThumbnails').StudyThumbnails} StudyThumbnails */

/**
 * @param {{
 *  index: number,
 *  active: boolean,
 *  item: StudyThumbnails,
 *  onClick: (item: StudyThumbnails) => void
 *  onThumbnailClick: (displaySetInstanceUid: string) => void
 * }} props 
 */
export function StudyThumbnails({ index, item, active, onClick, onThumbnailClick }) {
    const studyThumbnailsClassName = classnames('study-thumbnails', { 'active': active });
    return (
        <div className={studyThumbnailsClassName}>
            <StudyInfo item={item} onClick={onClick} />
            <SeriesThumbnails item={item} studyIndex={index} onClick={onThumbnailClick} />
        </div>
    );
}

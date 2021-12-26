/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 28, 2021 by PoyangLiu
 */

import './SeriesThumbnails.styl';
import React from 'react';
import { useSelector } from 'react-redux';
import { Thumbnail } from '@ohif/ui';
import { getActiveViewport } from '../../redux/selectors/viewports';

/* eslint-disable react/prop-types */
/** @typedef {import('./useStudyThumbnails').StudyThumbnails} StudyThumbnails */

/**
 * @param {{
 *  studyIndex: number,
 *  item: StudyThumbnails,
 *  onClick: (displaySetInstanceUid: string) => void
 * }} props 
 */
export function SeriesThumbnails({ studyIndex, item, onClick }) {
    const activeDisplaySetInstanceUID = useSelector(getActiveViewport)?.displaySetInstanceUID;

    return (
        <div className="series-thumbnails">
            {item.thumbnails.map((thumb, thumbIndex) => {
                const isDisplaySetActive = activeDisplaySetInstanceUID === thumb.displaySetInstanceUID;
                return (
                    <div
                        key={thumb.displaySetInstanceUID}
                        className="thumbnail-container"
                        data-cy="thumbnail-list"
                    >
                        <Thumbnail
                            id={`${studyIndex}_${thumbIndex}`} // Unused?
                            key={`${studyIndex}_${thumbIndex}`} // Unused?
                            active={isDisplaySetActive}
                            supportsDrag={true}
                            // Study
                            StudyInstanceUID={item.StudyInstanceUID} // used by drop
                            // Thumb
                            altImageText={thumb.altImageText}
                            imageId={thumb.imageId}
                            InstanceNumber={thumb.InstanceNumber}
                            displaySetInstanceUID={thumb.displaySetInstanceUID} // used by drop
                            numImageFrames={thumb.numImageFrames}
                            SeriesDescription={thumb.SeriesDescription}
                            SeriesNumber={thumb.SeriesNumber}
                            stackPercentComplete={thumb.stackPercentComplete}
                            hasWarnings={thumb.hasWarnings}
                            // Events
                            onClick={() => onClick(thumb.displaySetInstanceUID) }
                        />
                    </div>
                );
            })}
        </div>
    );
}

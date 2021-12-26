/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 04, 2021 by PoyangLiu
 */

import './StudyBrowser.styl';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { useStudyThumbnails } from './useStudyThumbnails';
import { StudyThumbnails } from './StudyThumbnails';

/**
 * This component is a container for a scrollable list of study thumbnails.
 * @param {Object} props
 * @param {types.OHIFStudy[]} props.studies 
 */
export function StudyBrowser({ studies }) {
    const [studyThumbnailsItems, onThumbnailClick] = useStudyThumbnails(studies);

    /** @type {types.useState<string>} */
    const [activeStudyInstanceUid, setActiveStudyInstanceUid] = useState();

    // Set initial active study instance uid when thumbnail items are loaded.
    useEffect(() => {
        if (activeStudyInstanceUid === undefined && studyThumbnailsItems.length > 0) {
            setActiveStudyInstanceUid(studyThumbnailsItems[0].StudyInstanceUID);
        }
    }, [activeStudyInstanceUid, studyThumbnailsItems])

    /**
     * Set to the new activeStudyInstanceUid or toggle
     * @param {import('./useStudyThumbnails').StudyThumbnails} item
     */
    function handleClick(item) {
        const newUid = activeStudyInstanceUid === item.StudyInstanceUID
            ? ''
            : item.StudyInstanceUID;
        setActiveStudyInstanceUid(newUid);
    }

    return (
        <div className="study-browser noselect">
            <div className="scrollable-study-thumbnails">
                {studyThumbnailsItems.map((item, i) => 
                    <StudyThumbnails key={i} index={i} item={item}
                        active={item.StudyInstanceUID === activeStudyInstanceUid}
                        onClick={handleClick}
                        onThumbnailClick={onThumbnailClick}
                    />
                )}
            </div>
        </div>
    );
}

StudyBrowser.propTypes = {
    studies: PropTypes.arrayOf(
        PropTypes.shape({
            StudyInstanceUID: PropTypes.string.isRequired,
            StudyDate: PropTypes.string,
            PatientID: PropTypes.string,
            displaySets: PropTypes.arrayOf(
                PropTypes.shape({
                    displaySetInstanceUID: PropTypes.string.isRequired,
                    SeriesDescription: PropTypes.string,
                    SeriesNumber: PropTypes.number,
                    InstanceNumber: PropTypes.number,
                    numImageFrames: PropTypes.number,
                    Modality: PropTypes.string.isRequired,
                    images: PropTypes.arrayOf(
                        PropTypes.shape({
                            getImageId: PropTypes.func.isRequired,
                        })
                    ),
                })
            ),
        })
    ),
};

/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 04, 2021 by PoyangLiu
 */

import OHIF from '@ohif/core';
import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { findDisplaySetByUID } from '@onepacs/cornerstone';
import { getLoading } from '../../redux/selectors/loading';

const { setActiveViewportSpecificData } = OHIF.redux.actions;

// This is defined in OHIFViewers LoadingIndicators.
const OHIFStackProgress = 'StackProgress';

/**
 * @typedef {Object} Thumbnail
 * @prop {string} imageId
 * @prop {string} altImageText
 * @prop {string} displaySetInstanceUID
 * @prop {string} SeriesDescription
 * @prop {number} SeriesNumber
 * @prop {number} InstanceNumber
 * @prop {number} numImageFrames
 * @prop {number} stackPercentComplete
 * @prop {Promise<string[] | string>} hasWarnings
 *
 * @typedef {Object} StudyThumbnails
 * @prop {string} StudyInstanceUID
 * @prop {string} StudyDescription
 * @prop {string} StudyDate
 * @prop {string} StudyTime
 * @prop {string} PatientName
 * @prop {string} PatientID
 * @prop {string[]} Modalities
 * @prop {Thumbnail[]} thumbnails
 */

/**
 * A custom hooks that converts studies to a list of study+thumbnails.
 * @param {types.OHIFStudy[]} studies
 * @returns {[
 *      StudyThumbnails[],
 *      (displaySetInstanceUID: string) => void
 * ]}
 */
export function useStudyThumbnails(studies) {
    const dispatch = useDispatch();

    /** @type {types.useState<StudyThumbnails[]>} */
    const [studyThumbnailsItems, setStudyThumbnailsItems] = useState([]);
    const loadingProgress = useSelector(getLoading).progress;

    function onThumbnailClick(displaySetInstanceUID) {
        let displaySet = findDisplaySetByUID(
            studies,
            displaySetInstanceUID
        );
    
        if (displaySet.isDerived) {
            const { Modality } = displaySet;
    
            displaySet = displaySet.getSourceDisplaySet(studies);
    
            if (!displaySet) {
                throw new Error(`Referenced series for ${Modality} dataset not present.`);
            }
    
            if (!displaySet) {
                throw new Error('Source data not present');
            }
        }
    
        dispatch(setActiveViewportSpecificData(displaySet));
    }

    useEffect(() => {
        const items = studies.map(mapStudyToStudyThumbnails);

        // add loading progress to each item
        items.forEach(item => {
            item.thumbnails.forEach(t => {
                const progressId = `${OHIFStackProgress}:${t.displaySetInstanceUID}`;
                const progressData = loadingProgress[progressId];
                t.stackPercentComplete = progressData ? progressData.percentComplete : 0;
            });
        });

        setStudyThumbnailsItems(items);
    }, [studies, loadingProgress]);

    return [studyThumbnailsItems, onThumbnailClick];
}

/**
 * @param {types.OHIFStudy} study
 * @returns {StudyThumbnails}
 */
function mapStudyToStudyThumbnails(study) {
    const thumbnails = study.displaySets.map(mapDisplaySetToThumbnail);
    return {
        StudyInstanceUID: study.StudyInstanceUID,
        StudyDescription: study.StudyDescription,
        StudyDate: study.StudyDate,
        StudyTime: study.StudyTime,
        PatientName: study.PatientName,
        PatientID: study.PatientID,
        Modalities: _.uniq(study.series.map(s => s.Modality)),
        thumbnails,
    };
}

/**
 * @param {types.DisplaySet} displaySet
 * @returns {Thumbnail}
 */
function mapDisplaySetToThumbnail(displaySet) {
    const {
        displaySetInstanceUID,
        SeriesDescription,
        SeriesNumber,
        InstanceNumber,
        numImageFrames,
    } = displaySet;

    let imageId;
    let altImageText;

    if (displaySet.Modality && displaySet.Modality === 'SEG') {
        // TODO: We want to replace this with a thumbnail showing
        // the segmentation map on the image, but this is easier
        // and better than what we have right now.
        altImageText = 'SEG';
    } else if (displaySet.images && displaySet.images.length) {
        const imageIndex = Math.floor(displaySet.images.length / 2);

        imageId = displaySet.images[imageIndex].getImageId();
    } else {
        altImageText = displaySet.Modality ? displaySet.Modality : 'UN';
    }

    return {
        imageId,
        altImageText,
        displaySetInstanceUID,
        SeriesDescription,
        SeriesNumber,
        InstanceNumber,
        numImageFrames,
        stackPercentComplete: 0,
        // This prop was added in https://github.com/OHIF/Viewers/issues/2259
        hasWarnings: Promise.resolve([])
    };
}

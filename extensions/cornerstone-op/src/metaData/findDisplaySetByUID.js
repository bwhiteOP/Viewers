/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 04, 2021 by PoyangLiu
 */

/**
 * Finds displaySet by UID across all displaySets inside studyMetadata
 * @see Viewers/platform/viewer/src/connectedComponents/findDisplaySetByUID.js
 * @param {Array} studyMetadata
 * @param {string} displaySetInstanceUID
 */
export function findDisplaySetByUID (studyMetadata, displaySetInstanceUID) {
    if (!Array.isArray(studyMetadata))
        return null;

    const allDisplaySets = studyMetadata.reduce((all, current) => {
        let currentDisplaySet = [];
        if (current && Array.isArray(current.displaySets)) {
            currentDisplaySet = current.displaySets;
        }
        return all.concat(currentDisplaySet);
    }, []);

    const bySetInstanceUID = ds => ds.displaySetInstanceUID === displaySetInstanceUID;

    const displaySet = allDisplaySets.find(bySetInstanceUID);
    return displaySet || null;
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 26, 2020 by Jay Liu
 */

// @ts-check
// eslint-disable-next-line no-unused-vars
import { types, storageKeys, localStorageUtils } from '@onepacs/core';

const storage = localStorageUtils(storageKeys.StudyMetadataRequests);

/**
 * Local storage accessor for StudyMetadataRequests
 * @typedef {Object} LocalStorageRequest
 * @param {string} requestId
 * @param {types.StudyMetadataRequest} studyMetadataRequest
 */
export const studyMetadataRequests = {
    /**
     * Gets studyMetadataRequest from localStorage given a requestId
     * @param {string} requestId
     * @returns {types.StudyMetadataRequest}
     */
    get: function(requestId) {
        /** @type {LocalStorageRequest[]} */
        const studyMetadataRequests = storage.tryGet([]);
        const existing = studyMetadataRequests.find(x => x.requestId === requestId);
        return existing ? existing.studyMetadataRequest : undefined;
    },

    /**
     * Stores the given studyMetadataRequest (that is the posted data from OP worklist) into localStorage
     * @param {string} requestId
     * @param {types.StudyMetadataRequest} studyMetadataRequest
     */
    set: function(requestId, studyMetadataRequest) {
        const studyMetadataRequests = storage.tryGet([]);
        studyMetadataRequests.push({
            requestId,
            studyMetadataRequest
        });
        storage.trySet(studyMetadataRequests);
    },

    /**
     * Clears studyMetadataRequests from localStorage
     * NOTE: This must be called when the user is logged out due to inactivity
     */
    clear: function () {
        storage.clear();
    }
};

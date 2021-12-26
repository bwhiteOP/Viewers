/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 10, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, log, routes, getAsync, postAsync } from '@onepacs/core';
import { useState, useEffect } from 'react';
import { studyMetadataRequests } from '../storage/studyMetadataRequests';
import { getStudyDataForStore, processStudiesToOpen } from './helpers';
import { useStudyData, useUser } from '../hooks';

/** @type {types.OpenStudiesRequest} */
let openStudiesRequestCache;

/**
 * @typedef {import('./helpers/processStudiesToOpen').ProcessStudiesResult} ProcessStudiesResult
*/

/**
 * Custom hook to load studies using the requestId.
 * @param {string} [requestId]
 * @returns {{ result?: ProcessStudiesResult, error?: Error}}
 */
export function useLoadStudies(requestId) {
    /** @type {types.useState<ProcessStudiesResult>} */
    const [result, setResult] = useState();
    /** @type {types.useState<Error?>} */
    const [error, setError] = useState(undefined);
    const [user, setUser] = useUser();
    const [, setStudyData] = useStudyData();

    useEffect(() => {
        /** @param {ProcessStudiesResult} result */
        function processResult(result) {
            result.studies.forEach(study => {
                setStudyData(study.StudyInstanceUID, getStudyDataForStore(study));
            });

            setResult(result);
        }

        async function fetchAsync() {
            // Retrieve OpenStudiesRequest from WebViewer server based on requestId
            /** @type {{ result?: types.OpenStudiesRequest, error?: Error }} */
            const { result: newOpenStudiesRequest } = await getAsync(routes.server.api.getOpenStudiesRequest, requestId);

            // Update cache. use the cache if the newest request is empty.
            const { openStudiesRequest, userAuthRequired } = getOrUpdateOpenStudiesRequestCache(newOpenStudiesRequest);

            if (openStudiesRequest) {
                // We have studies to open! Check user session expiry before continue...
                if (userAuthRequired) {
                    const success = postAsync(routes.server.api.checkUserToken, openStudiesRequest.studyMetadataRequest.userIdentity);
                    if (!success) {
                        setError(new Error('Session expired'));
                        openStudiesRequestCache = null;
                        return;
                    }
                }

                //  HV-21 Keep the user identity to check user session periodically
                //  HV-194 Keep the user permissions from OPS
                setUser({ identity: openStudiesRequest.studyMetadataRequest.userIdentity, permissions: openStudiesRequest.userPermissions });
                //  HV-20 Keep the studyMetadataRequest to be used in page refresh
                getOrUpdateStudyMetadataRequestStorage(requestId, openStudiesRequest.studyMetadataRequest);

                const result = processStudiesToOpen(openStudiesRequest.studiesToOpen);
                processResult(result);

            } else {
                // There is no openStudiesRequest from api-query or cache.

                // early exit if user session was never established
                if (!user.identity) {
                    setError(new Error('Session expired'));
                    openStudiesRequestCache = null;
                    return;
                }

                //  HV-20 Get the stored studyMetadataRequest
                const studyMetadataRequest = studyMetadataRequests.get(requestId);
                if (!studyMetadataRequest) {
                    log.error('Could not find an existing request.');
                    openStudiesRequestCache = null;
                    setError(new Error('Study not found'));
                    return;
                }

                /** @type {{ result?: types.GetStudiesResult, error?: Error}} */
                const { result: getStudiesResult, error: getStudiesError } = await postAsync(routes.server.api.getStudies, studyMetadataRequest);
                if (getStudiesError) {
                    log.error('Failed to get studies from server.', getStudiesError);
                    openStudiesRequestCache = null;
                    setError(new Error('Study not found'));
                    return;
                }

                const { userPermissions, studiesToOpen } = getStudiesResult;

                //  Cache openStudiesRequest
                openStudiesRequestCache = {
                    requestId,
                    studyMetadataRequest,
                    studiesToOpen,
                    userPermissions
                };

                //  HV-194 Inject userPermissions into studyMetadataRequest and keep it in UserUtils if defined
                if (userPermissions) {
                    setUser({ permissions: userPermissions });
                }

                const result = processStudiesToOpen(studiesToOpen);
                processResult(result);
            }
        }

        fetchAsync();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] /* run once only */);

    return { result, error };
}

/**
 * @param {types.StudyToOpen[]} studiesToOpen
 * @param {types.UserIdentity} userIdentity
 * @param {types.UserPermissions} userPermissions
 * @returns {ProcessStudiesResult}
 */
export function useExistingStudies(studiesToOpen, userIdentity, userPermissions) {
    /** @type {types.useState<ProcessStudiesResult>} */
    const [result, setResult] = useState();
    const [, setUser] = useUser();
    const [, setStudyData] = useStudyData();

    useEffect(() => {
        const result = processStudiesToOpen(studiesToOpen);
        result.studies.forEach(study => {
            setStudyData(study.StudyInstanceUID, getStudyDataForStore(study));
        });

        setResult(result);
        setUser({ identity: userIdentity, permissions: userPermissions });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] /* no deps. Must run only once */);

    return result;
}

/**
 * Get or update the openStudiesRequest cache .
 * @param {types.OpenStudiesRequest=} openStudiesRequest
 * @returns {{ openStudiesRequest?: types.OpenStudiesRequest, userAuthRequired: boolean }}
 */
function getOrUpdateOpenStudiesRequestCache(openStudiesRequest) {
    let userAuthRequired = false;

    //  Use the openStudiesRequest cache if it exists and openStudiesRequest could not be found
    if (openStudiesRequest) {
        openStudiesRequestCache = openStudiesRequest;
    } else {
        if (openStudiesRequestCache) {
            openStudiesRequestCache = openStudiesRequest;
            userAuthRequired = true;
        }
    }

    return { openStudiesRequest, userAuthRequired };
}

/**
 * Get or update StudyMetadaRequest in localStorage.
 * @param {string} requestId
 * @param {types.StudyMetadataRequest=} studyMetadataRequest
 * @returns {types.StudyMetadataRequest=}
 */
function getOrUpdateStudyMetadataRequestStorage(requestId, studyMetadataRequest) {
    if (!studyMetadataRequest) {
        //  HV-20 Get the stored studyMetadataRequest
        return studyMetadataRequests.get(requestId);
    } else {
        studyMetadataRequests.set(requestId, studyMetadataRequest);
        return studyMetadataRequest;
    }
}

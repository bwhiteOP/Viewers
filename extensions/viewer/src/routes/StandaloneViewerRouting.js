/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 10, 2020 by Jay Liu
 */

import React from 'react';

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { Viewer } from '../components';
import { useRouter } from '../hooks';
import { useLoadInitialUserPreferences } from '../hooks';
import { useExistingStudies } from './useLoadStudies';

function StandaloneViewerRouting() {
    const { studiesToOpen, userIdentity, userPermissions } = parseRouter(useRouter());
    useLoadInitialUserPreferences();
    const result = useExistingStudies(studiesToOpen, userIdentity, userPermissions);
    if (!result) {
        return (<div>Loading ...</div>);
    }

    return (
        <Viewer
            studies={result.studies}
            isStudyLoaded={true}
            studyInstanceUIDs={result.studyInstanceUIDs}
        />
    );
}

function parseRouter(router) {
    /** @type {{ itemToOpen?: types.GetStudiesResult, userIdentity?: types.UserIdentity }} */
    const { itemToOpen: getStudiesResult, userIdentity } = router.location.state;
    const { userPermissions, studiesToOpen } = getStudiesResult;

    return { studiesToOpen, userIdentity, userPermissions };
}

export default StandaloneViewerRouting;

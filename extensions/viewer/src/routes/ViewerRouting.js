/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 14, 2020 by Jay Liu
 */

import React from 'react';
import { Viewer, LoadError } from '../components';
import { useRouter, useSessionMonitor, useLoadInitialUserPreferences } from '../hooks';
import { useLoadStudies } from './useLoadStudies';

function ViewerRouting() {
    const { requestId } = parseRouter(useRouter());
    const isExpired = useSessionMonitor();
    useLoadInitialUserPreferences();

    // @ts-ignore
    const { result, error } = useLoadStudies(requestId);
    if (error) {
        return (<LoadError message='Failed to load studies from server.' error={error} />);
    }

    if (isExpired) {
        return (<LoadError message='Your session has ended. Please log back into OnePacs to continue.' />);
    }

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
    const { requestId } = router.match.params;
    return { requestId };
}

export default ViewerRouting;

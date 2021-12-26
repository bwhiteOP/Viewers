/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, routes } from '@onepacs/core';
import asyncComponent from '../components/AsyncComponent';
import NotFound from '../components/NotFound';

const ViewerRouting = asyncComponent(() =>
  import(/* webpackChunkName: "OnePacsViewerRouting" */ './ViewerRouting.js')
);

const StandaloneViewerRouting = asyncComponent(() =>
  import(/* webpackChunkName: "OnePacsStandaloneViewerRouting" */ './StandaloneViewerRouting.js')
);

const StudyListRouting = asyncComponent(() =>
  import(
    /* webpackChunkName: "OnePacsStudyListRouting" */ './StudyListRouting.js'
  )
);


/** @type {types.RoutesModule} */
export default {
    onepacs: {
        viewer: {
            path: `${routes.client.view}/:requestId`,
            component: ViewerRouting
        },
        standalone: {
            path: routes.client.standalone,
            component: StandaloneViewerRouting
        },
        studylist: {
            path: routes.client.studylist,
            component: StudyListRouting
        },

        notFound: {
            path: undefined,
            component: NotFound
        }
    }
};

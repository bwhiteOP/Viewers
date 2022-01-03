/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 09, 2020 by Jay Liu
 */

/**
 * Defines all the server/client route of WebViewer 2
 */
export const routes = {

    server: {

        /**
         * The entry route when OnePacs server calls WebViewer 2 to view study with posted data.
         * After getting study metadata and store it in a hash { requestId, OpenStudiesRequest },
         * it is then redirected to the client /view/:requestId
         * @method POST
         * @request types.ViewStudyRequestBody
         */
        viewStudy: '/viewStudy',

        /**
         * Websocket route used for retrieving DICOM images.
         */
        img: '/img',

        /**
         * Routes exposed by the WebViewer 2 server to be consumed by the client.
         */
        api: {
            /**
             * Gets the application info of the OnePacs WebViewer 2.
             * @method GET
             * @response types.ApplicationInfo
             */
            getAppInfo: '/api/getAppInfojgujg',

            /**
             * Gets the content of the openStudiesRequest based on the requestId.
             * @method GET
             * @param requestId
             * @response types.OpenStudiesRequest
             */
            getOpenStudiesRequest: '/api/getOpenStudiesRequest',

            /**
             * Check user identity to see if it is still valid.
             * @method POST
             * @request types.CheckUserTokenRequest
             * @response types.CheckUserTokenResult
             */
            checkUserToken: '/api/checkUserToken',

            /**
             * Retrieve the study metadata based on user identity and studyInstanceUids
             * Gets studies metadata and constructs studies object to load the requested studies
             * @method POST
             * @request types.GetStudiesRequest
             * @response types.GetStudiesResult
             */
            getStudies: '/api/getStudies',

            /**
             * Retrieve user preferences.
             * @method POST
             * @request types.RetrieveUserPreferencesRequest
             * @response types.RetrieveUserPreferencesResult
             */
            retrieveUserPreferences: '/api/retrieveUserPreferences',

            /**
             * Save user preferences.
             * @method POST
             * @request types.SaveUserPreferencesRequest
             * @response types.SaveUserPreferencesResult
             */
            saveUserPreferences: '/api/saveUserPreferences',

            /**
             * Save/upload the Presentation State object to the DICOM upload url.
             * @method POST
             * @request types.SavePresentationStateRequest
             * @response types.SavePresentationStateResult
             */
            savePresentationState: '/api/savePresentationState',
        },

        testing: {
            /**
             * Serves the json contents of the local testdata folder.
             * @method GET
             * @response types.GetStudiesResultMessage[]
             */
            testdata: '/testing/testdata'
        }
    },

    client: {

        /**
         * Client React route for viewing studies based on the requestId.
         * OpenStudyRequest is retrieve before viewing study.
         * @param requestId
         */
        view: '/view',

        /**
         * Client React route for displaying a studylist UI for the local testdata.
         * Pass the OpenStudyRequest of the selected study to the viewer route.
         */
        studylist: '/studylist',

        /**
         * Client React route for viewing studies from the studylist.
         * The OpenStudyRequest is available and passed to the route.
         * @param requestId
         */
        standalone: '/standalone',
    }
};

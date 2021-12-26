/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * July 21, 2020 by Jay Liu
 */

/**
 * This is not used, but it needs to be here to satisfy OHIF.
 * TODO: It would be good to disable this in OHIF and remove this config section.
 */
export default {
    dicomWeb: [
        {
            name: 'DCM4CHEE',
            wadoUriRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/wado',
            qidoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
            wadoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
            qidoSupportsIncludeField: true,
            imageRendering: 'wadors',
            thumbnailRendering: 'wadors',
            enableStudyLazyLoad: true,
            supportsFuzzyMatching: true,
        },
    ],
};

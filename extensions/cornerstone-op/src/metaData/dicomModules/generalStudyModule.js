/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

/**
 * Extract the general study module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.2.html
 */
export function generalStudyModule(imageId, instance) {
    if (!instance)
        return;

    return {
        studyInstanceUID: instance.StudyInstanceUID,
        studyDescription: instance.StudyDescription,
        studyDate: instance.StudyDate,
        studyTime: instance.StudyTime,
        accessionNumber: instance.AccessionNumber,
        institutionName: instance.InstitutionName
    };
}

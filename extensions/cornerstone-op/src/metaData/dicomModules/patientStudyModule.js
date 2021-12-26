/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

/**
 * Extract the patient study module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.2.2.html
 */
export function patientStudyModule(imageId, instance) {
    if (!instance)
        return;

    return {
        patientAge: instance.PatientAge,
        patientSex: instance.PatientSex,
        patientSize: instance.PatientSize,
        patientWeight: instance.PatientWeight,
    };
}

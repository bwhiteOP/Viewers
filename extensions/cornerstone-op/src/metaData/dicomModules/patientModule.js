/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

/**
 * Extract the patient modules of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.2.html
 */
export function patientModule(imageId, instance) {
    if (!instance)
        return;

    let patientName = instance.PatientName;
    if (patientName && patientName.Alphabetic) {
        patientName = patientName.Alphabetic;
    }

    return {
        patientName,
        patientId: instance.PatientID,
        patientHistory: instance.PatientHistory,
        issuerOfPatientId: instance.IssuerOfPatientId,
    };
}

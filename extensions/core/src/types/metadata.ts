/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 15, 2020 by Jay Liu
 */

/**
 * Metadata
 */

import { UserIdentity, UserPermissions } from './user';

export interface StudyMetadataRequest {
    userIdentity: UserIdentity;
    studyUids: string[];
    includeHistory?: boolean;
}

export interface StudyMetadataResult {
    success: boolean;
    message: string;
    userPermissions: UserPermissions;
    results: StudyMetadata[];
}


export interface PatientMetadata {
    name: string;
    mrn: string;
    sex: string;
    dob: string;
}

export interface StudyMetadata {
    studyUid: string;
    studyDescription: string;
    patient: PatientMetadata;
    facility: string;
    patientHistory: string;
    hasCompletedReport: boolean;
    studyDate: string;
    modalitiesInStudy: string;
    series: SeriesMetadata[]
    priors: StudyMetadata[]
}

export interface SeriesMetadata {
    seriesUid: string;
    seriesDescription: string;
    seriesNumber: string;
    modality: string;
    instances: InstanceMetadata[];
}

export interface InstanceMetadata {
    transferSyntax: string;
    transferSyntaxUid: string;
    instanceNumber: string;
    sopInstanceUid: string;
    sopClassUid: string;
    numberOfFrames: number;
    fileLocation: string;
}

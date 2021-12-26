/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 15, 2020 by Jay Liu
 */

/**
 * Type definition for integrating with OnePacs Server API
 */

import { UserPermissions } from './user';
import { StudyMetadataRequest } from './metadata';

export interface ViewStudyRequestBody {
    data: {
        token: string;
        userId: string;
        studyUids: string[];
    }
}

export interface OpenStudiesRequest {
    requestId: string;
    studyMetadataRequest: StudyMetadataRequest;
    studiesToOpen: StudyToOpen[];
    userPermissions?: UserPermissions;
}

export interface StudyToOpen {
    primaryStudyUid: string;
    studies: Study[];
}

export interface Study {
    studyInstanceUid: string;
    studyDescription: string;
    patientName: string;
    patientId: string;
    patientSex: string;
    patientBirthdate: string;
    institutionName: string;
    patientHistory: string;
    hasCompletedReport: boolean;
    studyDateUTC: string;
    modalities: string[];
    priorFor: string;
    seriesList: Series[];
}

export interface Series {
    seriesInstanceUid: string;
    seriesDescription: string;
    seriesNumber: string;
    modality: string;
    instances: Instance[];
}

export interface Instance{
    transferSyntax: string;
    instanceNumber: string;
    sopInstanceUid: string;
    sopClassUid: string;
    numberOfFrames: number;
    urls: string[];
}

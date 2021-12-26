/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 15, 2020 by Jay Liu
 */

/**
 * Type definition for the Server/Client API
 */

import { UserIdentity, UserPermissions } from './user';
import { UserPreferences } from './userPreferences';
import { StudyToOpen } from './onepacs';
import { StudyMetadataRequest } from './metadata';

export interface ApplicationInfo {
    name: string;
    version: string;
    description: string;
    author: string;
}

export interface BooleanResult {
    success: boolean;
}

export interface CheckUserTokenRequest {
    userIdentity: UserIdentity;
}

export interface CheckUserTokenResult extends BooleanResult {
}

export interface GetStudiesRequest extends StudyMetadataRequest {
}

export interface GetStudiesResult {
    userPermissions: UserPermissions;
    studiesToOpen: StudyToOpen[];
}

export interface GetStudiesResultMessage {
    msg: string;
    id: string;
    result: GetStudiesResult;
}

export interface RetrieveUserPreferencesRequest {
    userIdentity: UserIdentity;
    keysToRetrieve: (keyof UserPreferences)[];
}

export interface RetrieveUserPreferencesResult extends BooleanResult {
    preferences: UserPreferences;
}

export interface SaveUserPreferencesRequest {
    userIdentity: UserIdentity;
    preferencesToSave: UserPreferences;
}

export interface SaveUserPreferencesResult extends BooleanResult {
}

export interface SavePresentationStateRequest {
    userIdentity: UserIdentity;
    studyUid: string;
    presentationState: number[];
}

export interface SavePresentationStateResult extends BooleanResult {
}

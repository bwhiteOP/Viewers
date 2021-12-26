/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 15, 2020 by Jay Liu
 */


/**
 * Type definition of the user for the current WebViewer2 session.
 */
export interface User {
    identity?: UserIdentity;
    permissions: UserPermissions; // not optional. There should be default permissions
}

export interface UserIdentity {
    token: string;
    userId: string;
}

export interface UserPermissions {
    allowPathologyClassification: boolean;
    allowViewReports: boolean;
    allowFullDICOM: boolean;
    allowDownload: boolean;
    allowUpload: boolean;
    allowUserPreferences: boolean;
}

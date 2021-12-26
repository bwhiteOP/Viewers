/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * May 31, 2021 by Jay Liu
 */

import React from 'react';
import { useUser, useUserPreferences } from '../../hooks/user';
import { useImageLoadingProgress, useImageDecompressStatus } from '../../hooks/viewer';
import { Icon } from '../../components/Icon';

export function ImageStatus({ imageId }) {
    const [user] = useUser();
    const [advancedPreferences] = useUserPreferences('advanced');
    const percentComplete = useImageLoadingProgress(imageId);
    const decompressStatus  = useImageDecompressStatus(imageId);
    
    //  HV-194 Skip if disabled in the user permissions
    if (user.permissions && !user.permissions.allowFullDICOM) {
        return <div className="imageStatus"></div>
    }

    //  HV-167 Skip if Bandwidth Saving Mode is enabled
    if (advancedPreferences && advancedPreferences.BandwidthSavingModeEnabled) {
        return <div className="imageStatus"></div>
    }

    // Completed, nothing to show
    if (decompressStatus === 'end' || percentComplete === 100) {
        return <div className="imageStatus"></div>
    }

    if (decompressStatus === 'failed') {
        return <div className="imageStatus">An error occurred during decompression</div>
    }

    if (decompressStatus === 'begin') {
        return (
            <div className="imageStatus">
                <span>Decompressing... </span>
                <Icon key='circle-notch' name="circle-notch"  className="icon-spin" />
            </div>
        )
    } else {
        return (
            <div className="imageStatus">
                <span>Downloading... </span>
                <Icon key='circle-notch' name="circle-notch"  className="icon-spin" />
                <span>{percentComplete}%</span>
            </div>
        )
    }
}

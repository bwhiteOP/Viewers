/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 13, 2020 by Jay Liu
 */

/**
 * Extract the general image module of an instance.
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.6.html
 */
export function generalImageModule(imageId, instance) {
    if (!instance)
        return;

    return {
        acquisitionTime: instance.AcquisitionTime,
        sopInstanceUid: instance.SOPInstanceUID,
        instanceNumber: instance.InstanceNumber,
        lossyImageCompression: instance.LossyImageCompression,
        lossyImageCompressionRatio: instance.LossyImageCompressionRatio,
        lossyImageCompressionMethod: instance.LossyImageCompressionMethod,
    };
}

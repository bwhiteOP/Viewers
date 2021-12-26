/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 17, 2020 by Jay Liu
 */

/**
 * A subset of the transfer syntaxes
 * @see http://dicom.nema.org/medical/dicom/current/output/chtml/part06/chapter_A.html
 */
export const transferSyntaxes = {
    '1.2.840.10008.1.2': { // Implicit VR Little Endian
        lossless: false,
        lossy: false
    },
    '1.2.840.10008.1.2.1': { // Explicit VR Little Endian
        lossless: false,
        lossy: false
    },
    '1.2.840.10008.1.2.2': { // Explicit VR Big Endian (retired)
        lossless: false,
        lossy: false
    },
    '1.2.840.10008.1.2.1.99': { // Deflate transfer syntax (deflated by dicomParser)
        lossless: true,
        lossy: false
    },
    '1.2.840.10008.1.2.5': { // RLE Lossless
        lossless: true,
        lossy: false
    },
    '1.2.840.10008.1.2.4.50': { // JPEG Baseline lossy process 1 (8 bit)
        lossless: false,
        lossy: true
    },
    '1.2.840.10008.1.2.4.51': { // JPEG Baseline lossy process 2 & 4 (12 bit)
        lossless: false,
        lossy: true
    },
    '1.2.840.10008.1.2.4.57': { // JPEG Lossless, Nonhierarchical (Processes 14)
        lossless: true,
        lossy: false
    },
    '1.2.840.10008.1.2.4.70': { // JPEG Lossless, Nonhierarchical (Processes 14 [Selection 1])
        lossless: true,
        lossy: false
    },
    '1.2.840.10008.1.2.4.80': { // JPEG-LS Lossless Image Compression
        lossless: true,
        lossy: false
    },
    '1.2.840.10008.1.2.4.81': { // JPEG-LS Lossy (Near-Lossless) Image Compression
        lossless: false,
        lossy: true
    },
    '1.2.840.10008.1.2.4.90': { // JPEG 2000 Lossless
        lossless: true,
        lossy: false
    },
    '1.2.840.10008.1.2.4.91': { // JPEG 2000 Lossy
        lossless: false,
        lossy: true
    }
};

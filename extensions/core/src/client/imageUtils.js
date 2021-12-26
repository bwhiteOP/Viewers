/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 17, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { ParsedImageId } from '../types/cornerstone';
import { transferSyntaxes } from './dicom/transferSyntaxes';

export const imageUtils = {

    /**
     * Combine urls obtained from OnePacs cloud api GetStudiesResult
     * @param {string[]} urls
     * @returns {string} combined urls as imageId
     */
    combineImageUrls(urls) {
        return urls.join('|');
    },

    /**
     * Parse OnePacs imageId, which may be composed of wado url and the actual imageId (websocket), into parts.
     * @param {string} imageId
     * @returns {ParsedImageId[]}
     */
    parseImageId: function (imageId) {
        return parseCombinedImageId(imageId);
    },

    /**
     * Parse and returns only the actual imageId.
     * @param {string} imageId
     * @returns {ParsedImageId}
     */
    getActualImageId: function (imageId) {
        const parsedImageIds = parseCombinedImageId(imageId);
        if (parsedImageIds.length < 1) {
            return;
        }

        // OnePacs uses websocket to retrieve DICOm instance.
        let actualImageId = parsedImageIds.find(id => id.scheme === 'websocket');
        if (!actualImageId) {
            // Fallback to the first one, which is wado
            actualImageId = parsedImageIds[0];
        }

        return actualImageId;
    },

    isCompressed: function (transferSyntax) {
        const ts = transferSyntaxes[transferSyntax];
        return ts && (ts.lossless || ts.lossy);
    }
};

/**
 * Parse OnePacs imageId, which may be composed of wado and actual imageId, into parts.
 * @param {string} combinedImageId
 * @returns {ParsedImageId[]}
 */
function parseCombinedImageId(combinedImageId) {
    const parsedImageIds = [];

    const imageIdsToParse = combinedImageId.split('|');
    imageIdsToParse.forEach((imageId) => {
        const firstColonIndex = imageId.indexOf(':');
        const scheme = imageId.substr(0, firstColonIndex);
        const url = imageId.substring(firstColonIndex + 1);

        parsedImageIds.push({
            imageId: imageId,
            scheme,
            url
        });
    });

    return parsedImageIds;
}

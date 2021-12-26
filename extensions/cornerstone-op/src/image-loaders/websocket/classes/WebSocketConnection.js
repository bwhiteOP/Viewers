/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

import { EVENTS, log, bufferUtils, routes, getPublicUrl } from '@onepacs/core';
import urljoin from 'url-join';
import cornerstone from 'cornerstone-core';
import { WebSocketStreamClient } from './WebSocketStreamClient';

export class WebSocketConnection {

    constructor() {
        /**
         * @typedef {Object} AwaitingRequest
         * @prop {*} imageId
         * @prop {string} filePath
         * @prop {ArrayBuffer} fileContent
         * @prop {Function} doneCallback
         */

        /** @type {AwaitingRequest[]} */
        this.awaitingRequests = [];

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const { hostname, port } = window.location;
        this.wsUrl = urljoin(`${wsProtocol}//${hostname}:${port}`, getPublicUrl(), routes.server.img);
    }

    /**
     * @param {string} imageId
     * @param {string} filePath
     * @param {Function} doneCallback
     */
    send(imageId, filePath, doneCallback) {
        //  Add the request into the awaiting requests
        this.awaitingRequests.push({
            imageId,
            filePath,
            fileContent: new Uint8Array(),
            doneCallback
        });

        if (!this.wsc || (this.wsc && this.wsc.readyState === WebSocket.CLOSED)) {
            //  Connection is CLOSED, so _initialize the connection
            this._initialize();
        } else if (this.wsc.readyState === WebSocket.OPEN) {
            //  Connection is OPEN, so send the request immediately
            this.wsc.send(filePath);
        }
    }


    /**
     * @returns {boolean} whether there are any requests waiting to be sent.
     */
    isBusy() {
        return this.awaitingRequests.length > 0;
    }

    //------------------------------------------------------------------------------
    // Private methods
    //------------------------------------------------------------------------------

    _initialize() {
        if (this.wsc) {
            this.wsc.close();
            this.wsc = undefined;
        }

        this.wsc = new WebSocketStreamClient(this.wsUrl);

        this.wsc.onopen = (evt) => {
            this._onopen();
        };

        this.wsc.onclose = (evt) => {
            this._onclose();
        };

        this.wsc.onstream = (data) => {
            this._onstream(data);
        };
    }

    _onopen() {
        if (!this.awaitingRequests.length) {
            return;
        }

        //  Send the awaiting requests
        this.awaitingRequests.forEach((awaitingRequest) => {
            this.wsc.send(awaitingRequest.filePath);
        });
    }

    _onclose() {
        if (!this.awaitingRequests.length) {
            return;
        }

        //  Re-_initialize the connection whenever it is lost
        this._initialize();
    }

    /**
     * @param {import ('./WebSocketStreamClient').WebSocketData} decodedData
     */
    _onstream(decodedData) {
        //  Get the awaiting request which the streamed data belongs to
        const awaitingRequestIndex = this.awaitingRequests.findIndex(obj => obj.filePath === decodedData.key);
        if (awaitingRequestIndex < 0 || !this.awaitingRequests[awaitingRequestIndex]) {
            log.error('WebSocketStreamClient: Unknown data chunk');
            return;
        }

        const awaitingRequest = this.awaitingRequests[awaitingRequestIndex];

        //  Merge the streamed data if streaming is not ended yet
        if (decodedData.data.byteLength !== 0) {
            awaitingRequest.fileContent = bufferUtils.mergeBuffers(awaitingRequest.fileContent, decodedData.data);

            //  HV-58 Show the loading progress in percentage
            const loaded = awaitingRequest.fileContent.byteLength;
            const total = decodedData.prefix;
            const percentComplete = Math.round((loaded / total) * 100);
            cornerstone.triggerEvent(cornerstone.events, EVENTS.IMAGE_LOAD_PROGRESS, {
                imageId: awaitingRequest.imageId,
                loaded,
                total,
                percentComplete
            });

            return;
        }

        //  Call the callback when streaming is ended and the image is ready
        awaitingRequest.doneCallback(awaitingRequest.fileContent);
        this.awaitingRequests.splice(awaitingRequestIndex, 1);
    }

}

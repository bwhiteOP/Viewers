/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

import { log, bufferUtils } from '@onepacs/core';

/**
 * @typedef WebSocketData
 * @prop {number} prefix
 * @prop {string} key
 * @prop {ArrayBuffer} data
 */


/**
 * Class implementation for WebSocketStreamClient which is
 * a subclass of WebSocket to receive data in chunks
 * NOTE: Inheritance is implemented manually as it is impossible to extend WebSocket
 */
export class WebSocketStreamClient {

    constructor(options) {
        this.super = new WebSocket(options);
        this.super.binaryType = 'arraybuffer';

        const self = this;
        this.super.onopen = function (evt) {
            self._onopen(evt);
        };
        this.super.onclose = function (evt) {
            self._onclose(evt);
        };
        this.super.onerror = function (evt) {
            self._onerror(evt);
        };
        this.super.onmessage = function (evt) {
            self._onmessage(evt);
        };

        // Public methods to be overwritten by consumer

        /** @param {Event} evt */
        this.onopen = (evt) => {};
        /** @param {Event} evt */
        this.onclose = (evt) => {};
        /** @param {Event} evt */
        this.onerror = (evt) => {};
        /** @param {MessageEvent} evt */
        this.onmessage = (evt) => {};
        /** @param {WebSocketData} data */
        this.onstream = (data) => {};
    }

    /**
     * @returns {number}
     * WebSocket.CONNECTING	0,
     * WebSocket.OPEN 1,
     * WebSocket.CLOSING 2,
     * WebSocket.CLOSED	3
     */
    get readyState() {
        return this.super.readyState;
    }

    /** @param {string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView} data */
    send(data) {
        this.super.send(data);
    }

    /**
     * @param {number} [code]
     * @param {string} [reason]
     */
    close(code, reason) {
        this.super.close(code, reason);
    }

    /**
     * Private, do not call
     * @param {Event} evt
     */
    _onopen(evt) {
        if (this.onopen) {
            this.onopen(evt);
        }
    }

    /**
     * Private, do not call
     * @param {Event} evt
     */
    _onclose(evt) {
        if (this.onclose) {
            this.onclose(evt);
        }
    }

    /**
     * Private, do not call
     * @param {Event} evt
     */
    _onerror(evt) {
        if (this.onerror) {
            this.onerror(evt);
        }

        log.error('WebSocketStreamClient: Error Occurred.', evt);
    }

    /**
     * Private, do not call
     * @param {MessageEvent} evt
     */
    _onmessage(evt) {
        if (this.onmessage) {
            this.onmessage(evt);
        }

        if (this.onstream) {
            this.onstream(decodeData(evt.data));
        }
    }

}

/**
 * Decode websocket data.
 * @param {ArrayBuffer} dataAsBuffer
 * @returns {WebSocketData}
 */
function decodeData(dataAsBuffer) {
    //  Payload: PREFIX (4 BYTES) + KEY_LENGTH (4 BYTES) + KEY + DATA

    //  First 32 bits (4 bytes) indicate KEY_LENGTH
    const prefix = bufferUtils.bufferToInt(dataAsBuffer.slice(0, 4));

    //  Next 32 bits (4 bytes) indicate KEY_LENGTH
    const keyLength = bufferUtils.bufferToInt(dataAsBuffer.slice(4, 8));

    //  Next KEY_LENGTH bytes indicate key
    const key = bufferUtils.bufferToString(dataAsBuffer.slice(8, 8 + keyLength));

    //  Other bytes indicate data
    const data = dataAsBuffer.slice(8 + keyLength);

    return {
        prefix,
        key,
        data
    };
}

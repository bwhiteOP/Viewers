/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */

import _ from 'lodash';
import { publicSettings } from '@onepacs/core';
import { WebSocketConnection } from './WebSocketConnection';

class WebSocketConnectionPool {

    constructor() {
        /**
         * @typedef PoolItem
         * @prop {number} id
         * @prop {Date} lastAccessedTime
         * @prop {WebSocketConnection} connection
         */

        /** @type {PoolItem[]} */
        this.pool = [];
        this.size = 1;

        const cachedSettings = publicSettings.cached();
        //  Get the pool size from public settings
        if (cachedSettings.WebSocketConnectionPoolSize) {
            this.size = cachedSettings.WebSocketConnectionPoolSize;
        }

        //  Initialize all pool items
        for (let id = 0; id < this.size; id++) {
            const lastAccessedTime = new Date();
            const connection = new WebSocketConnection();
            this.pool.push({
                id,
                lastAccessedTime,
                connection
            });
        }
    }

    /**
     * @param {string} imageId
     * @param {string} filePath
     * @param {Function} doneCallback
     */
    send(imageId, filePath, doneCallback) {
        //  Get an available pool item
        let bestPoolItem = this.pool.find(poolItem => !poolItem.connection.isBusy());
        if (!bestPoolItem) {
            //  Get the least used pool item if there is no available pool item
            bestPoolItem = _.minBy(this.pool, poolItem => poolItem.lastAccessedTime);
        }

        //  Update the last accessed time
        bestPoolItem.lastAccessedTime = new Date();

        return bestPoolItem.connection.send(imageId, filePath, doneCallback);
    }
}

//  WebSocket Connection Pool Singleton:
const WebSocketConnectionPoolInstance = new WebSocketConnectionPool();
export { WebSocketConnectionPoolInstance };

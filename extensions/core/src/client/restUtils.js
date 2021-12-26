/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 19, 2020 by Jay Liu
 */

import { log } from '../both/log';
import axios from 'axios';
import urljoin from 'url-join';

/**
 * Gets the PUBLIC_URL.
 * The value should be saved as an environment variable at start time.
 * @returns {string}
 */
export function getPublicUrl() {
    if (typeof window !== 'undefined') {
        // @ts-ignore
        return window?.process?.env?.PUBLIC_URL || window.PUBLIC_URL;
    }
}

/**
 * POST to the server at the specified route.
 * @method POST
 * @param {string} route
 * @param {Object=} params
 * @returns {Promise<{ result?: any, error?: Error }>}
 */
export async function postAsync(route, params) {
    route = urljoin(getPublicUrl(), route);

    try {
        /** @type {import("axios").AxiosResponse} */
        const response = await axios.post(route, params);

        // TODO: handle any HTTP Statuses?
        return { result: response?.data, error: undefined };
    } catch (error) {
        log.error(`Error during POST ${route}`, error);
        return { result: undefined, error };
    }
}

/**
 * GET from the server at the specified route.
 * @method GET
 * @param {string} route
 * @param {string=} param
 * @returns {Promise<{ result?: any, error?: Error }>}
 */
export async function getAsync(route, param) {
    route = urljoin(getPublicUrl(), route);

    try {
        const url = param ? urljoin(route, param) : route;

        /** @type {import("axios").AxiosResponse} */
        const response = await axios.get(url);

        // TODO: handle any HTTP Statuses?
        return { result: response?.data, error: undefined };
    } catch (error) {
        log.error(`Error during GET ${route}`, error);
        return { result: undefined, error };
    }
}

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { Dictionary } from '../general';

export interface Route {
    /** Path of this route. */
    path: string;
    /** React component to load when this route is matched. */
    component: Object | Function;
    /**
     * Gets whether this component should be loaded.
     * @param appConfig
     */
    condition?(appConfig?: any): void;
}

export type RouteGroup = Dictionary<Route>;

export type RoutesModule = Dictionary<RouteGroup>;

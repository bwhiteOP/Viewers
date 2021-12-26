/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

export type RouteContext = 'ROUTE:VIEWER' | 'ROUTE:STUDY_LIST';

export type ViewportContext = 'VIEWER' | 'ACTIVE_VIEWPORT::CORNERSTONE' | 'ACTIVE_VIEWPORT::VTK'

export type ExtensionContext = RouteContext | ViewportContext;

type OhifStoreContext = 'extensions' | 'loading' | 'preferences' | 'servers' | 'studies' | 'timepointManager' | 'viewports' | 'oidc';
type OnePacsStoreContext = 'userPreferences';

export type StoreContext = OhifStoreContext | OnePacsStoreContext;

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { DisplaySet } from '../ohif';

export interface SopClassHandlerModule {
    id: string;
    sopClassUIDs: string[];
    getDisplaySetFromSeries(series: any, study: any, dicomWebClien: any, authorizationHeaders: any): DisplaySet;
}

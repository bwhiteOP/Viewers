/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { Dictionary } from '../general';
import { ViewportContext, StoreContext } from './context';

export interface CommandDefinition {
    /** The function to call when command is run. Receives options and storeContexts. */
    commandFn: CommandAction;
    /** Expected redux state objects to be passed in as props. */
    storeContexts?: StoreContext[];
    /** Arguments to pass at the time of calling to the commandFn */
    options?: Dictionary<any>;
    /** Overrides the defaultContext. Let's us know if command is currently "available" to be run. */
    context?: ViewportContext;
}

export type CommandAction = (params?: Dictionary<any>) => void;

export interface CommandsModule {
    definitions: Dictionary<CommandDefinition>;
    actions?: Dictionary<CommandAction>;
    defaultContext: ViewportContext | ViewportContext[];
}

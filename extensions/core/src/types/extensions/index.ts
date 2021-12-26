/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { CommandsModule } from './commandsModule';
import { SopClassHandlerModule } from './sopClassHandlerModule';
import { RoutesModule } from './routesModule';
import { ToolbarModule } from './toolbarModule';
import { PanelModule } from './panelModule';
import { ViewportModule } from './viewportModule';

export * from './context';
export * from './commandsModule';
export * from './sopClassHandlerModule';
export * from './routesModule';
export * from './toolbarModule';
export * from './panelModule';
export * from './viewportModule';

export type ServiceName = 'MeasurementService' | 'LoggerService' | 'UIModalService' | 'UIDialogService' | 'UINotificationService';
export interface ServiceManager {
    services: { [service in ServiceName]: any };
    registeredServiceNames: ServiceName[];
}

export interface ModuleFunctionParameters {
    servicesManager?: ServiceManager;
    commandsManager?: any;
    appConfig?: any;
    configuration?: any;
}

/**
 * Defines the type of an OHIF extension.
 * @see https://docs.ohif.org/extensions/
 */
export interface Extension {
    /**
     * Only required property. Should be a unique value across all extensions.
     */
    id: string;

    /**
     * LIFECYCLE HOOKS
     * https://docs.ohif.org/extensions/#lifecycle-hooks
     */
    preRegistration?: (params?: ModuleFunctionParameters) => void;

    /**
     * Adds named commands, scoped to a context, to the CommandsManager
     * @see https://docs.ohif.org/extensions/modules/commands.html
     */
    getCommandsModule?: (params?: ModuleFunctionParameters) => CommandsModule;

    /**
     * Adds left or right hand side panels
     * @see https://docs.ohif.org/extensions/modules/panel.html */
    getPanelModule?: (params?: ModuleFunctionParameters) => PanelModule;

    /**
     * Determines how retrieved study data is split into "DisplaySets"
     * @see https://docs.ohif.org/extensions/modules/sop-class-handler.html
     */
    getSopClassHandlerModule?: (params?: ModuleFunctionParameters) => SopClassHandlerModule;

    /**
     * Adds buttons or custom components to the toolbar.
     * @see https://docs.ohif.org/extensions/modules/toolbar.html
     */
    getToolbarModule?: (params?: ModuleFunctionParameters) => ToolbarModule;

    /**
     * Adds a component responsible for rendering a "DisplaySet"
     * @see https://docs.ohif.org/extensions/modules/viewport.html
     */
    getViewportModule?: (params?: ModuleFunctionParameters) => ViewportModule;

    // -----------------------------------------------
    // Extension created by OnePacs
    // -----------------------------------------------

    /**
     * Adds custom routes.
     */
    getRoutesModule?: (params?: ModuleFunctionParameters) => RoutesModule;
}

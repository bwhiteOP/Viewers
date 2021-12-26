/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { Dictionary } from '../general';
import { ViewportContext } from './context';

export type ToolbarButtonType = 'command' | 'setToolActive' | 'builtIn';

/**
 * Toolbar button definitions.
 * @see https://docs.ohif.org/extensions/modules/toolbar.html#button-definitions
 */
export interface ToolbarButton {
    /** Unique button id */
    id: string;
    /** Label to be shwon on the UI. */
    label: string;
    /** Tooltip for this button */
    tooltip?: Tooltip;
    /** One of the value in ToolbarButtonType */
    type?: ToolbarButtonType;
    /** Name of the icon to display. See {@link https://react.ohif.org/elements/icon} */
    icon?: string;
    /**
     * A function to determine if the button should be disabled.
     * @param {*} state The state of the redux store
     */
    disableFunction?: (state: any) => boolean;
    /** Context that can be used to scope functionality. {@link https://docs.ohif.org/extensions/#contexts} */
    context?: string;
    /** Options specific to this button. */
    options?: ToolbarButtonOptions;
    /** If 'type' is 'command'. Label to be shwon on the UI. */
    commandName?: string;
    /** Command specific. Options to be passed to the specified command. */
    commandOptions?: Dictionary<any>;
    /** If 'type' is 'setToolActive'. Note the capitalize 'C'. A custom React component for the button. */
    CustomComponent?: React.ComponentClass<any> | React.FunctionComponent<any>;
    /** Click handler for this button.  */
    onClick?: (evt: MouseEvent, props?: any) => void;
    /** The button is expandable if it contains nested buttons. */
    buttons?: ToolbarButton[];
}

export interface Tooltip {
    title: string;
    description?: string;
}

export interface ToolbarButtonOptions {
    behavior?: string;
    /** Defaults to true */
    togglable?: boolean;
}

export interface ToolbarModule {
    definitions: ToolbarButton[] | ((state: any) => ToolbarButton[]);
    defaultContext: ViewportContext | ViewportContext[];
}

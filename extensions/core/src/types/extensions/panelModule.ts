/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { ViewportContext } from './context';

export interface PanelMenuOption {
    /** A suggested icon. Available icons determined by consuming app */
    icon: string;
    /** A suggested label */
    label: string;
    /** 'right' or 'left' */
    from: 'right' | 'left';
    /** The target component to toggle open/close */
    target: string;
    /** UI Hint; If the target panel is in a "disabled" state */
    isDisabled: (studies?: Object[]) => boolean;
    /** Overrides `defaultContext`, if specified */
    context?: ViewportContext[];
}

export interface PanelComponent {
    id: string;
    component: React.ComponentClass<any> | React.FunctionComponent<any>;
}

export interface PanelModule {
    menuOptions: PanelMenuOption[];
    components: PanelComponent[];
    defaultContext?: ViewportContext | [ViewportContext];
}

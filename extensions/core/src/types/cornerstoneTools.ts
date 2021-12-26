/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

import { MouseButtonMask } from '../client';
import { Dictionary, Point } from './general';

export interface PointsGroup {
    page: Point;
    image: Point;
    client: Point;
    canvas: Point;
}

export interface CornerstoneToolsMouseEventData {
    event: MouseEvent;
    buttons: MouseButtonMask;
    viewport: Object,
    image: Object,
    element: HTMLElement,
    startPoints: PointsGroup;
    lastPoints: PointsGroup;
    currentPoints: PointsGroup;
    deltaPoints: PointsGroup;
    type: string;
}

export declare class BaseTool {
    constructor(props: Dictionary<any>, defaultProps: Dictionary<any>);

    name: string;
    mode: string;
    element: HTMLElement;
    supportedInteractionTypes: string[];
    strategies: any[];
    defaultStrategy: any;
    activeStrategy: any;


    configuration: any;
    get options(): Dictionary<any>;

    /** Merges provided options with existing options. */
    mergeOptions(): Dictionary<any>;
    /** Clears the tools options. */
    clearOptions(): void;

    /**
     * Apply the currently set/active strategy.
     * @param {Object} evt The event that triggered the strategies application
     * @param {Object} operationData - An object containing extra data not present in the `evt`,
     *                                 required to apply the strategy.
     * @returns {any} strategies vary widely; check each specific strategy to find expected return value
     */
    applyActiveStrategy(evt: Object, operationData: Object): void;

    /** Change the active strategy. */
    setActiveStrategy(strategy: string): void;
    /** Reset back to the default strategy. */
    setDefaultStrategy(): void;

    /**
     * Function responsible for changing the Cursor, according to the strategy.
     * @param {HTMLElement} element
     * @param {string} strategy The strategy to be used on Tool
     */
    changeCursor(element: HTMLElement, strategy: string): void;
}

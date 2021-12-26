/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 28, 2020 by Jay Liu
 */

export type MouseButton = 'Left' | 'Middle' | 'Right';

export interface WithId<T> {
    id: number;
    value: T;
}

export type Kvp<T> = [string, T];

export interface Dictionary<T> {
    [key: string]: T;
}

export interface LeftRight<T> {
    left?: T,
    right?: T
}

export interface StartEnd<T> {
    start?: T,
    end?: T
}

export interface Point {
    x: number;
    y: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface BoundingRectangle {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}

export type MouseButtonMask = 0 // None
    | 1 // primary (usually the left button)
    | 2 // secondary (usually the right button)
    | 4 // auxiliary (usually wheel or middle button)
    | 8
    | 16;

export type ValueOf<T> = T[keyof T];

export type TypeOfIterable<TIterable> = TIterable extends Iterable<infer T> ? T : never;

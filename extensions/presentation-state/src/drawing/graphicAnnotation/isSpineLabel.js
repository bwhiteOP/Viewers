/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

const spineLabels = [
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'C6',
    'C7',
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
    'L1',
    'L2',
    'L3',
    'L4',
    'L5',
    'S1'
];

/**
 * Check if the label is a valid spine label.
 * @param {string} label
 */
export function isSpineLabel(label) {
    return spineLabels.includes(label);
}

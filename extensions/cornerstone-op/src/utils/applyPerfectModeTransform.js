/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

/**
 * Transform the provided measurement data to a perfect measurment.
 * The start handle is now the center point.
 * The end handle is used to determine the distance/radius.
 * The start/end handles are then recalculated.
 * @param {*} data
 */
export function applyPerfectModeTransform(data) {
    const center = data.centerPoint || Object.assign({}, data.handles.start);
    const deltaX = data.handles.end.x - center.x;
    const deltaY = data.handles.end.y - center.y;
    const radius = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

    data.handles.start.x = center.x - radius;
    data.handles.start.y = center.y - radius;
    data.handles.end.x = center.x + radius;
    data.handles.end.y = center.y + radius;

    data.centerPoint = center;
}

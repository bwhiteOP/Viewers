/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 03, 2020 by Jay Liu
 */

export function displayArea(data) {
    let meanValue = '';
    const { cachedStats } = data;
    if (cachedStats && cachedStats.mean && !isNaN(cachedStats.mean)) {
        meanValue = cachedStats.mean.toFixed(2) + ' HU';
    }
    return meanValue;
}

export function displayLength(data) {
    let lengthValue = '';
    if (data.length && !isNaN(data.length)) {
        lengthValue = data.length.toFixed(2) + ' mm';
    }
    return lengthValue;
}

export function displayAngle(data) {
    let text = '';
    if (data.rAngle && !isNaN(data.rAngle)) {
        text = data.rAngle.toFixed(2) + String.fromCharCode(parseInt('00B0', 16));
    }
    return text;
}

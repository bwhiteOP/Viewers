/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 23, 2020 by Jay Liu
 */


function capitalizeFirstChar(lower) {
    return lower.charAt(0).toUpperCase() + lower.substr(1);
}

function capitalizeAllButFirstElement(x, i) {
    return i === 0 ? x : capitalizeFirstChar(x);
}

module.exports = (pkg) => {
    const tokens = pkg.name.split(/[@\\-\\/]/).filter(x => x);
    const newName = tokens
        .map((x, i) => { return capitalizeAllButFirstElement(x, i); })
        .join('');
    return newName;
}

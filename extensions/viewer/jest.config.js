/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * July 21, 2020 by Jay Liu
 */

const base = require('../../../../Viewers/jest.config.base.js');
const pkg = require('./package.json');

module.exports = {
    ...base,
    name: pkg.name,
    displayName: pkg.name,
};

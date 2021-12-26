/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 07, 2020 by Jay Liu
 */

const path = require('path');
const pkg = require('./package.json');
const webpackBase = require('../../webpack.base.js');

const ROOT_DIR = path.join(__dirname, './');
const SRC_DIR = path.join(__dirname, './src');
const DIST_DIR = path.join(__dirname, './dist');

const serverConfig = webpackBase({ ROOT_DIR, SRC_DIR, DIST_DIR, pkg, TARGET: 'node' });
const clientConfig = webpackBase({ ROOT_DIR, SRC_DIR, DIST_DIR, pkg, TARGET: 'web' });

module.exports = [ serverConfig, clientConfig ]

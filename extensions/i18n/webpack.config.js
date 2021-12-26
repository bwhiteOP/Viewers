/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 24, 2020 by Jay Liu
 */

const merge = require('webpack-merge');
const path = require('path');
const webpackCommon = require('../../../../Viewers/.webpack/webpack.commonjs.js');
const pkg = require('./package.json');
const getLibraryNameFromPackage = require('../../.webpack/helpers/getLibraryNameFromPackage.js');

const ROOT_DIR = path.join(__dirname, './');
const SRC_DIR = path.join(__dirname, './src');
const DIST_DIR = path.join(__dirname, './dist');

module.exports = (env, argv) => {
    const commonConfig = webpackCommon(env, argv, { SRC_DIR, DIST_DIR });

    return merge(commonConfig, {
        devtool: 'source-map',
        stats: {
            colors: true,
            hash: true,
            timings: true,
            assets: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: false,
            warnings: true,
        },
        optimization: {
            minimize: true,
            sideEffects: true,
        },
        output: {
            path: ROOT_DIR,
            library: getLibraryNameFromPackage(pkg),
            libraryTarget: 'umd',
            filename: pkg.main,
        },
    });
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 23, 2020 by Jay Liu
 */

// @ts-nocheck
/**
 * Webpack shared configuration file.
 *
 * This file will be called/merged by other webpack.js from packages/* and extensions/*
 * The relative path in this file should be relative to the calling webpack.js.
 *
 * Copy and modified from https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/.webpack/webpack.base.js
 */

require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const PACKAGE_JSON = require('./package.json');
const nodeExternals = require('webpack-node-externals');
const getLibraryNameFromPackage = require('./.webpack/helpers/getLibraryNameFromPackage.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const transpileJavaScriptRule = require('./.webpack/rules/transpileJavaScript.js');

module.exports = ({ ROOT_DIR, SRC_DIR, DIST_DIR, pkg, TARGET }) => {
    // ~~ ENV VARS
    const BUILD_NUM = process.env.BUILD_NUM || '0'; // TODO. What does OnePacs use for build number?
    const NODE_ENV = process.env.NODE_ENV || 'production';
    const isProdBuild = NODE_ENV === 'production';
    const isDebugBuild = process.env.DEBUG_BUILD === 'true';
    const mode = NODE_ENV === 'production' ? 'production' : 'development';
    const target = TARGET || 'web';
    const isTargetingNode = target === 'node';
    const entryFile = isTargetingNode ? 'index.js' : 'browser.js';

    console.debug(`Building ${pkg.name} v${pkg.version} ${mode}${isDebugBuild ? '|DEBUG' : ''} targeting '${target}' ...`);

    // https://webpack.js.org/configuration/devtool/
    // https://blog.scottlogic.com/2017/11/01/webpack-source-map-options-quick-guide.html
    let devtool = 'none';
    if (isProdBuild) {
        devtool = isDebugBuild ? 'source-map' : false;
    } else {
        devtool = 'eval-source-map';
    }

    const config = {
        target: target,
        mode: mode,
        devtool: devtool,
        entry: {
            app: `${SRC_DIR}/${entryFile}`,
        },
        module: {
            rules: [
                { test: /\.js$/, use: ['source-map-loader'], enforce: 'pre' },
                transpileJavaScriptRule(mode),
            ]
        },
        optimization: {
            minimize: isProdBuild,
            sideEffects: true,
        },
        performance: {
            hints: false // hide big assets warning
        },
        context: SRC_DIR,
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
        resolve: {
            // Which directories to search when resolving modules
            modules: [
                // Modules specific to this package
                path.resolve(ROOT_DIR, './node_modules'),
                // Hoisted Yarn Workspace Modules
                path.resolve(__dirname, './node_modules'),
                SRC_DIR,
            ],
            // Attempt to resolve these extensions in order.
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '*'],
            // symlinked resources are resolved to their real path, not their symlinked location
            symlinks: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                /* Application */
                'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
                'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
                'process.env.APP_CONFIG': JSON.stringify(process.env.APP_CONFIG || ''),
                'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '/'),
                'process.env.VERSION_NUMBER': JSON.stringify(PACKAGE_JSON.version || ''),
                'process.env.BUILD_NUM': JSON.stringify(BUILD_NUM),
            }),
        ],
    };

    config.output = {
        path: ROOT_DIR,
        library: getLibraryNameFromPackage(pkg),   // name of the global object
        libraryTarget: 'umd',
        globalObject: 'this',
        filename: isTargetingNode ? pkg.main : pkg.browser
    };

    if (isProdBuild) {
        config.optimization.minimize = !isDebugBuild;
        config.optimization.sideEffects = true; // https://github.com/webpack/webpack/blob/v4.20.1/examples/side-effects/README.md
        config.optimization.minimizer = [
            (compiler) => {
                new TerserJSPlugin({
                    // Supports: source-map and inline-source-map
                  //  sourceMap: isDebugBuild,
                    parallel: true,
                    terserOptions: {}
                }).apply(compiler);
            },
        ];

        // in order to ignore all modules in node_modules folder
        if (isTargetingNode)
            config.externals = [nodeExternals()];
    }

    return config;
};

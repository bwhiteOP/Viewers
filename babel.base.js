/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 23, 2020 by Jay Liu
 */

/**
 * Babel configuration file.
 * https://babeljs.io/docs/en/options
 */

module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-typescript'
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        [ '@babel/plugin-transform-typescript', { allowNamespaces: true } ]
    ],
    env: {
        production: {
            ignore: ['**/*.test.jsx', '**/*.test.js', '__snapshots__', '__tests__'],
        },
        development: {
            ignore: ['**/*.test.jsx', '**/*.test.js', '__snapshots__', '__tests__'],
        },
        test: {
        }
    }
};

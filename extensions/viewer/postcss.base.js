/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 23, 2020 by Jay Liu
 */

/**
 * Postcss configuration file.
 * It is loaded with postcss-loader by webpack to trasnforming css with javascript.
 * @see https://postcss.org/
 * @see https://github.com/postcss/postcss#css-in-js
 */
module.exports = function(ctx) {
    ctx = ctx || {};
    ctx.env = ctx.env || 'development';

    return {
        map: ctx.env === 'development' ? ctx.map : false,
        plugins: {
            'postcss-import': {},
            'postcss-preset-env': {},
            cssnano: ctx.env === 'production' ? {} : false,
        },
    };
};

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * August 24, 2020 by Jay Liu
 */

import * as Index from './index';

describe('Top level exports', () => {
    test('have not changed', () => {
        const expectedExports = [
            'default',
        ].sort();

        const exports = Object.keys(Index).sort();

        expect(exports).toEqual(expectedExports);
    });
});

/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import * as Index from './index';

describe('Top level exports', () => {
    test('have not changed', () => {
        const expectedExports = [
            'presentationStateExtension',
        ].sort();

        const exports = Object.keys(Index).sort();

        expect(exports).toEqual(expectedExports);
    });
});

/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * June 08, 2021 by Jay Liu
 */

import { useEffect } from 'react';
import { usePrevious } from './usePrevious';

/**
 * A custom hook for debugging which dependencies are triggering useEffect.
 * 
 * @see https://stackoverflow.com/a/59843241
 * 
 * @example
 *  useEffectDebugger(() => {
 *    // useEffect code here... 
 *  }, [dep1, dep2])
 * 
 * @example
 * useEffectDebugger(() => {
 *   // useEffect code here... 
 * }, [dep1, dep2], ['dep1', 'dep2'])
 * 
 * @param {React.EffectCallback} effectHook 
 * @param {React.DependencyList} [dependencies]
 * @param {string[]} [dependencyNames] Optional descriptive name for the dependencies
 */
export function useEffectDebugger(effectHook, dependencies, dependencyNames = []) {
    const previousDeps = usePrevious(dependencies, []);
  
    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }
  
        return accum;
    }, {});
  
    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }
  
    useEffect(effectHook, dependencies);
}
  
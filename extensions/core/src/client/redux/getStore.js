/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

/**
 * This function retrieve the redux store.
 * The `window.store` is set by OHIF `platform/viewers/src/App.js`.
 * It is meant to be used outside of React as a temporary measure.
 * All access to redux state (outside of react) should use this
 * instead of getting it directly from the `window` object.
 */
export function getStore() {
    // @ts-ignore
    return window.store;
}

/**
 * Observe redux store for specific changes. Calls the callback when the state slice changes.
 * Note that this observe subscriber uses references equality, so it works best with primitive.
 * Subscribing to an object changed will cause the callback to be called with every state change.
 *
 * This should used minimally and when it needs to be done outside of React.js.
 *
 * @param {function[]} selectors
 * @param {function(any, any[]): void} callback
 */
export function observeStore(selectors, callback) {
    const store = getStore();
    let currentStates = Array.from({ length: selectors.length });

    function handleChange() {
        const entireStoreState = store.getState();
        let hasChanges = false;
        selectors.forEach((selectFrom, i) => {
            let newState = selectFrom(entireStoreState);
            if (newState !== currentStates[i]) {
                currentStates[i] = newState;
                hasChanges = true;
            }

        });

        if (hasChanges) {
            callback(entireStoreState, currentStates);
        }
    }

    const unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

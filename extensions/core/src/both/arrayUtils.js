/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 06, 2020 by Jay Liu
 */

/**
 * Utils to provide additional functionalities not existed in the array.prototype.
 */
export const arrayUtils = {
    /**
     * Determine whether two arrays intersect.
     * @param {any[]} array1
     * @param {any[]} array2
     * @returns {boolean}
     */
    hasIntersection: function(array1, array2) {
        return array1.some(value => array2.includes(value));
    },

    /**
     * Find the intersection of two arrays.
     * @template T
     * @param {T[]} array1
     * @param {T[]} array2
     * @returns {T[]} The intersection
     */
    intersection: function(array1, array2) {
        return array1.filter(value => array2.includes(value))
    },

    /**
     * Determine whether the superset contains all elements of subset.
     * @param {any[]} superset
     * @param {any[]} subset
     * @returns {boolean}
     */
    includes: function (superset, subset) {
        if (superset.length < subset.length) return false;

        return subset.every(value => superset.includes(value));
    },

    /**
     * Split an array into two halves.
     * @template T
     * @param {T[]} arr
     * @returns {T[][]} an array containing two splitted arrays.
     */
    splitInHalf: function(arr) {
        const splitted = [];
        const halfway = Math.ceil(arr.length / 2);
        splitted.push(arr.slice(0, halfway));
        splitted.push(arr.slice(halfway, arr.length));
        return splitted;
    }

};

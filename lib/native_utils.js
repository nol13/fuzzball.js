/**
 * Native JavaScript replacements for lodash functions
 * Uses lodash for orderBy while providing native implementations for other functions
 */

// Import lodash directly
const _ = require('lodash');

// Replacement for lodash/intersection
function _intersect(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return [];
    
    // For small arrays, a simple filter is faster
    if (arr1.length < 100 && arr2.length < 100) {
        return arr1.filter(item => arr2.includes(item));
    }
    
    // For larger arrays, using a Set for O(1) lookups is more efficient
    const set = new Set(arr2);
    return arr1.filter(item => set.has(item));
}

// Replacement for lodash/intersectionWith
function _intersectWith(arr1, arr2, comparator) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return [];
    return arr1.filter(a => arr2.some(b => comparator(a, b)));
}

// Replacement for lodash/difference
function _difference(arr1, arr2) {
    if (!arr1) return [];
    if (!arr2 || arr2.length === 0) return arr1.slice();
    
    // For small arrays, a simple filter is faster
    if (arr1.length < 100 && arr2.length < 100) {
        return arr1.filter(item => !arr2.includes(item));
    }
    
    // For larger arrays, using a Set for O(1) lookups is more efficient
    const set = new Set(arr2);
    return arr1.filter(item => !set.has(item));
}

// Replacement for lodash/differenceWith
function _differenceWith(arr1, arr2, comparator) {
    if (!arr1) return [];
    if (!arr2 || arr2.length === 0) return arr1.slice();
    return arr1.filter(a => !arr2.some(b => comparator(a, b)));
}

// Replacement for lodash/uniq
function _uniq(arr) {
    if (!arr || arr.length === 0) return [];
    if (arr.length === 1) return arr.slice();
    return [...new Set(arr)];
}

// Replacement for lodash/uniqWith
function _uniqWith(arr, comparator) {
    if (!arr || arr.length === 0) return [];
    if (arr.length === 1) return arr.slice();
    
    return arr.filter((item, index, self) => 
        index === self.findIndex(other => comparator(item, other))
    );
}

// Replacement for lodash/partialRight
function _partialRight(func) {
    const boundArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        const args = Array.prototype.slice.call(arguments);
        return func.apply(this, args.concat(boundArgs));
    };
}

// Replacement for lodash/forEach - Simplified as it's only used for arrays and objects
function _forEach(obj, callback) {
    if (!obj) return;
    
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            callback(obj[i], i);
        }
    } else {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            callback(obj[keys[i]], keys[i]);
        }
    }
}

// Replacement for lodash/keys - Simple wrapper around Object.keys
function _keys(obj) {
    return Object.keys(obj);
}

// Replacement for lodash/isArray - Simple wrapper around Array.isArray
function _isArray(obj) {
    return Array.isArray(obj);
}

// Use lodash's orderBy directly for best performance
function _orderBy(collection, iteratee, order) {
    return _.orderBy(collection, iteratee, order);
}

module.exports = {
    _intersect,
    _intersectWith,
    _difference,
    _differenceWith,
    _uniq,
    _uniqWith,
    _partialRight,
    _forEach,
    _keys,
    _isArray,
    _orderBy
}; 
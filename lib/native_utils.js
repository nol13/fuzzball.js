/**
 * Native JavaScript replacements for lodash functions
 */

// Replacement for lodash/intersection
function _intersect(arr1, arr2) {
    return arr1.filter(function(item) {
        return arr2.includes(item);
    });
}

// Replacement for lodash/intersectionWith
function _intersectWith(arr1, arr2, comparator) {
    return arr1.filter(function(a) {
        return arr2.some(function(b) {
            return comparator(a, b);
        });
    });
}

// Replacement for lodash/difference
function _difference(arr1, arr2) {
    return arr1.filter(function(item) {
        return !arr2.includes(item);
    });
}

// Replacement for lodash/differenceWith
function _differenceWith(arr1, arr2, comparator) {
    return arr1.filter(function(a) {
        return !arr2.some(function(b) {
            return comparator(a, b);
        });
    });
}

// Replacement for lodash/uniq
function _uniq(arr) {
    return arr ? [...new Set(arr)] : [];
}

// Replacement for lodash/uniqWith
function _uniqWith(arr, comparator) {
    if (!arr) return [];
    return arr.filter(function(item, index, self) {
        return index === self.findIndex(function(other) {
            return comparator(item, other);
        });
    });
}

// Replacement for lodash/partialRight
function _partialRight(func) {
    var boundArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return func.apply(this, args.concat(boundArgs));
    };
}

// Replacement for lodash/forEach
function _forEach(obj, callback) {
    if (Array.isArray(obj)) {
        obj.forEach(function(value, index) {
            callback(value, index);
        });
    } else {
        Object.keys(obj).forEach(function(key) {
            callback(obj[key], key);
        });
    }
}

// Replacement for lodash/keys
function _keys(obj) {
    return Object.keys(obj);
}

// Replacement for lodash/isArray
function _isArray(obj) {
    return Array.isArray(obj);
}

// Replacement for lodash/toArray
function _toArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.slice();
    if (typeof value === 'string') return value.split('');
    return Object.values(value);
}

// Replacement for lodash/orderBy
function _orderBy(collection, iteratees, orders) {
    // Handle single iteratee case
    if (typeof iteratees === 'function') {
        const iteratee = iteratees;
        return collection.slice().sort(function(a, b) {
            const valA = iteratee(a);
            const valB = iteratee(b);
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        });
    }
    
    // For our specific use case in the codebase, we just need the first item
    // This is a simplified implementation that works for the specific use case
    return collection.slice().sort(function(a, b) {
        const valA = iteratees(a);
        const valB = iteratees(b);
        // For 'desc' order
        return valB - valA;
    });
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
    _toArray,
    _orderBy
}; 
/**
 * Native JavaScript replacements for lodash functions
 * Optimized for performance and minimal functionality needed by fuzzball
 */

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

// Replacement for lodash/toArray
function _toArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.slice();
    if (typeof value === 'string') return value.split('');
    return Object.values(value);
}

// Replacement for lodash/orderBy - Optimized based on how it's used in fuzzball
function _orderBy(collection, iteratees, orders) {
    if (!collection || collection.length === 0) return [];
    
    // Clone the collection to avoid modifying the original
    const result = collection.slice();
    
    // Handle the single iteratee case which is the most common use in fuzzball
    if (typeof iteratees === 'function') {
        const iteratee = iteratees;
        
        // Sort with respect to the order parameter
        if (orders === 'desc') {
            return result.sort((a, b) => {
                const valA = iteratee(a);
                const valB = iteratee(b);
                
                // Optimize for numbers which is common in cosine similarity
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return valB - valA;
                }
                
                return valB < valA ? -1 : valB > valA ? 1 : 0;
            });
        }
        
        // Default ascending order
        return result.sort((a, b) => {
            const valA = iteratee(a);
            const valB = iteratee(b);
            
            // Optimize for numbers
            if (typeof valA === 'number' && typeof valB === 'number') {
                return valA - valB;
            }
            
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        });
    }
    
    // The case where iteratees is already a function but not wrapped in the first parameter
    // This is simpler than the full lodash implementation and covers the fuzzball use case
    if (orders === 'desc') {
        return result.sort((a, b) => {
            const valA = iteratees(a);
            const valB = iteratees(b);
            
            // Optimize for numbers
            if (typeof valA === 'number' && typeof valB === 'number') {
                return valB - valA;
            }
            
            return String(valB).localeCompare(String(valA));
        });
    }
    
    // Default ascending order
    return result.sort((a, b) => {
        const valA = iteratees(a);
        const valB = iteratees(b);
        
        // Optimize for numbers
        if (typeof valA === 'number' && typeof valB === 'number') {
            return valA - valB;
        }
        
        return String(valA).localeCompare(String(valB));
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
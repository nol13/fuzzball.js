/**
 * Native JavaScript replacements for lodash functions
 */

function _intersect(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return [];
    
    if (arr1.length < 100 && arr2.length < 100) {
        return arr1.filter(item => arr2.includes(item));
    }
    
    const set = new Set(arr2);
    return arr1.filter(item => set.has(item));
}

function _intersectWith(arr1, arr2, comparator) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return [];
    return arr1.filter(a => arr2.some(b => comparator(a, b)));
}

function _difference(arr1, arr2) {
    if (!arr1) return [];
    if (!arr2 || arr2.length === 0) return arr1.slice();
    
    if (arr1.length < 100 && arr2.length < 100) {
        return arr1.filter(item => !arr2.includes(item));
    }
    
    const set = new Set(arr2);
    return arr1.filter(item => !set.has(item));
}

function _differenceWith(arr1, arr2, comparator) {
    if (!arr1) return [];
    if (!arr2 || arr2.length === 0) return arr1.slice();
    return arr1.filter(a => !arr2.some(b => comparator(a, b)));
}

function _uniq(arr) {
    if (!arr || arr.length === 0) return [];
    if (arr.length === 1) return arr.slice();
    return [...new Set(arr)];
}

function _uniqWith(arr, comparator) {
    if (!arr || arr.length === 0) return [];
    if (arr.length === 1) return arr.slice();
    
    const result = [];
    
    outer: for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        
        for (let j = 0; j < result.length; j++) {
            if (comparator(current, result[j])) {
                continue outer;
            }
        }
        
        result.push(current);
    }
    
    return result;
}

function _partialRight(func) {
    const boundArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        const args = Array.prototype.slice.call(arguments);
        return func.apply(this, args.concat(boundArgs));
    };
}

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

module.exports = {
    _intersect,
    _intersectWith,
    _difference,
    _differenceWith,
    _uniq,
    _uniqWith,
    _partialRight,
    _forEach,
    _isArray: Array.isArray
}; 
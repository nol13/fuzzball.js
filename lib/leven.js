// @ts-check
// levenshtein distance without astral support

/** from https://github.com/hiddentao/fast-levenshtein slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */
var collator;
try {
    collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
} catch (err) {
    if (typeof console !== undefined) console.warn("Collator could not be initialized and wouldn't be used");
}

module.exports = function leven(a, b, options) {

    /** from https://github.com/sindresorhus/leven slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */
    var arr = [];
    var charCodeCache = [];
    var useCollator = (options && collator && options.useCollator);
    var subcost = 1;
    //to match behavior of python-Levenshtein and fuzzywuzzy, set to 2 in _ratio
    if (options && options.subcost && typeof options.subcost === "number") subcost = options.subcost;

    if (a === b) {
        return 0;
    }

    var aLen = a.length;
    var bLen = b.length;

    if (aLen === 0) {
        return bLen;
    }

    if (bLen === 0) {
        return aLen;
    }

    var bCharCode;
    var ret;
    var tmp;
    var tmp2;
    var i = 0;
    var j = 0;

    while (i < aLen) {
        charCodeCache[i] = a.charCodeAt(i);
        arr[i] = ++i;
    }
    if (!useCollator) {  //checking for collator inside while 2x slower
        while (j < bLen) {
            bCharCode = b.charCodeAt(j);
            tmp = j++;
            ret = j;
            for (i = 0; i < aLen; i++) {
                tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + subcost;
                tmp = arr[i];
                ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
            }
        }
    }
    else {
        while (j < bLen) {
            bCharCode = b.charCodeAt(j);
            tmp = j++;
            ret = j;

            for (i = 0; i < aLen; i++) {
                tmp2 = 0 === collator.compare(String.fromCharCode(bCharCode), String.fromCharCode(charCodeCache[i])) ? tmp : tmp + subcost;
                tmp = arr[i];
                ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
            }
        }
    }
    return ret;

}
// @ts-check
// levenshtein distance with wildcard support

/** from https://github.com/hiddentao/fast-levenshtein slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */
var collator;
try {
    collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
} catch (err) {
    if (typeof console !== undefined) console.warn("Collator could not be initialized and wouldn't be used");
}

module.exports = function leven(a, b, options, regLeven) {
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

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // not doing full check in _ratio as of now
    if (options && options.wildcards && typeof options.wildcards === "string" && options.wildcards.length > 0) {
        var wildchar;
        var wildcode;
        if (options.full_process === false && options.processed !== true) {
            wildchar = options.wildcards[0];
            wildcode = wildchar.charCodeAt(0);
            var pattern = '[' + escapeRegExp(options.wildcards) + ']';
            a = a.replace(new RegExp(pattern, "g"), wildchar);
            b = b.replace(new RegExp(pattern, "g"), wildchar);
            if (a === b) return 0; //check again post replacement
        }
        else {
            wildchar = options.wildcards[0].toLowerCase();
            wildcode = wildchar.charCodeAt(0);
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
                    tmp2 = bCharCode === charCodeCache[i] || bCharCode === wildcode || charCodeCache[i] === wildcode ? tmp : tmp + subcost;
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
                    tmp2 = 0 === collator.compare(String.fromCharCode(bCharCode), String.fromCharCode(charCodeCache[i]))
                        || bCharCode === wildcode || charCodeCache[i] === wildcode ? tmp : tmp + subcost;
                    tmp = arr[i];
                    ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
                }
            }
        }
        return ret;
    }
    else {
        return regLeven(a, b, options)
    }
}
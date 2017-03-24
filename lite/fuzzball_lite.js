(function () {
    'use strict';
    var Heap = require('heap');
    var _intersect = require('./lodash.custom.min.js').intersection;
    var _difference = require('./lodash.custom.min.js').difference;
    var _uniq = require('./lodash.custom.min.js').uniq;
    var _toArray = require('./lodash.custom.min.js').toArray;
    require('setimmediate');
    require('string.prototype.codepointat');
    require('string.fromcodepoint');
/** Mostly follows after python fuzzywuzzy, https://github.com/seatgeek/fuzzywuzzy */


/** Public functions */

    function distance(str1, str2, options_p) {
        /**
         * Calculate levenshtein distance of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein distance (0 and above).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (typeof options.subcost === "undefined") options.subcost = 1;
        if (options.astral) return _iLeven(str1, str2, options);
        else return _leven(str1, str2, options);
    }

    function QRatio(str1, str2, options_p) {
        /**
         * Calculate levenshtein ratio of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _ratio(str1, str2, options);
    }

    function token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate token set ratio of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _token_set(str1, str2, options);
    }

    function token_sort_ratio(str1, str2, options_p) {
        /**
         * Calculate token sort ratio of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        if (!options.proc_sorted) {
            str1 = process_and_sort(str1);
            str2 = process_and_sort(str2);
        }
        return _ratio(str1, str2, options);
    }

    function extract(query, choices, options_p) {
        /**
         * Return the top scoring items from an array (or assoc array) of choices
         *
         * @param {string} query - the search term.
         * @param {String[]|Object[]|Object} choices - array of strings, or array of choice objects if processor is supplied, or object of form {key: choice}
         * @param {Object} [options_p] - Additional options.
         * @param {function} [options_p.scorer] - takes two strings, or string and object, and returns a score
         * @param {function} [options_p.processor] - takes each choice and outputs a string to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {Object[]} - array of choice results with their computed ratios (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        var isArray = false;
        var numchoices;
        if (choices && choices.length && Array.isArray(choices)) {
            numchoices = choices.length;
            isArray = true; //if array don't check hasOwnProperty every time below
        }
        else numchoices = Object.keys(choices).length;
        if (!choices || numchoices === 0) console.log("No choices");
        if (options.processor && typeof options.processor !== "function") console.log("Invalid Processor");
        if (!options.processor) options.processor = function(x) {return x;}
        if (!options.scorer || typeof options.scorer !== "function") {
            options.scorer = QRatio;
            console.log("Using default scorer 'ratio'");
        }
        var isCustom = _isCustomFunc(options.scorer); // check if func name is one of fuzzball's, so don't use same names..
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1;}
        var pre_processor = function(choice, force_ascii) {return choice;}
        if (options.full_process) pre_processor = full_process;
        if (!isCustom) { // if custom scorer func let scorer handle it
            query = pre_processor(query, options.force_ascii);
            options.full_process = false;
            if (query.length === 0) console.log("Processed query is empty string");
        }
        var results = [];
        var anyblank = false;
        var tsort = false;
        var tset = false;
        if (options.scorer.name === "token_sort_ratio" || options.scorer.name === "partial_token_sort_ratio") {
            var proc_sorted_query = process_and_sort(query);
            tsort = true;
        }
        else if (options.scorer.name === "token_set_ratio" || options.scorer.name === "partial_token_set_ratio") {
            var query_tokens = tokenize(query);
            tset = true;
        }
        var idx, mychoice, result;
        for (var c in choices) {
            if (isArray || choices.hasOwnProperty(c)) {
                options.tokens = undefined;
                options.proc_sorted = false;
                if (tsort) {
                    options.proc_sorted = true;
                    if (choices[c].proc_sorted) mychoice = choices[c].proc_sorted;
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                        mychoice = process_and_sort(mychoice);
                    }
                    result = options.scorer(proc_sorted_query, mychoice, options);
                }
                else if (tset) {
                    mychoice = "x"; //dummy string so it validates
                    if (choices[c].tokens) options.tokens = [query_tokens, choices[c].tokens];
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                        options.tokens = [query_tokens, tokenize(mychoice)]
                    }
                    //query and mychoice only used for validation here
                    result = options.scorer(query, mychoice, options);
                }
                else if (isCustom) {
                    // options.full_process should be unmodified, don't pre-process here since mychoice maybe not string
                    mychoice = options.processor(choices[c]);
                    result = options.scorer(query, mychoice, options);
                }
                else {
                    mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                    if (typeof mychoice !== "string" || mychoice.length === 0) anyblank = true;
                    result = options.scorer(query, mychoice, options);
                }
                if (isArray) idx = parseInt(c);
                else idx = c;
                if (result > options.cutoff) results.push([choices[c], result, idx]);
            }
        }
        if(anyblank) console.log("One or more choices were empty. (post-processing if applied)")
        if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices && !options.unsorted) {
            var cmp = function(a, b) { return a[1] - b[1]; }
            results = Heap.nlargest(results, options.limit, cmp);
        }
        else if (!options.unsorted) {
            results = results.sort(function(a,b){return b[1]-a[1];});
        }
        return results;
    }

    function extractAsync(query, choices, options_p, callback) {
        /**
         * Return the top scoring items from an array (or assoc array) of choices
         *
         * @param {string} query - the search term.
         * @param {String[]|Object[]|Object} choices - array of strings, or array of choice objects if processor is supplied, or object of form {key: choice}
         * @param {Object} [options_p] - Additional options.
         * @param {function} [options_p.scorer] - takes two strings, or string and object, and returns a score
         * @param {function} [options_p.processor] - takes each choice and outputs a string to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {Object[]} - array of choice results with their computed ratios (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        var isArray = false;
        var numchoices;
        if (choices && choices.length && Array.isArray(choices)) {
            numchoices = choices.length;
            isArray = true; //if array don't check hasOwnProperty every time below
        }
        else numchoices = Object.keys(choices).length;
        if (!choices || numchoices === 0) console.log("No choices");
        if (options.processor && typeof options.processor !== "function") console.log("Invalid Processor");
        if (!options.processor) options.processor = function (x) { return x; }
        if (!options.scorer || typeof options.scorer !== "function") {
            options.scorer = QRatio;
            console.log("Using default scorer 'ratio'");
        }
        var isCustom = _isCustomFunc(options.scorer); // check if func name is one of fuzzball's, so don't use same names..
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1; }
        var pre_processor = function (choice, force_ascii) { return choice; }
        if (options.full_process) pre_processor = full_process;
        if (!isCustom) { // if custom scorer func let scorer handle it
            query = pre_processor(query, options.force_ascii);
            options.full_process = false;
            if (query.length === 0) console.log("Processed query is empty string");
        }
        var results = [];
        var anyblank = false;
        var tsort = false;
        var tset = false;
        if (options.scorer.name === "token_sort_ratio" || options.scorer.name === "partial_token_sort_ratio") {
            var proc_sorted_query = process_and_sort(query);
            tsort = true;
        }
        else if (options.scorer.name === "token_set_ratio" || options.scorer.name === "partial_token_set_ratio") {
            var query_tokens = tokenize(query);
            tset = true;
        }
        var idx, mychoice, result;
        var keys = Object.keys(choices);
        isArray ? searchLoop(0) : searchLoop(keys[0], 0);
        function searchLoop (c, i) {
            if (isArray || choices.hasOwnProperty(c)) {
                options.tokens = undefined;
                options.proc_sorted = false;
                if (tsort) {
                    options.proc_sorted = true;
                    if (choices[c].proc_sorted) mychoice = choices[c].proc_sorted;
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                        mychoice = process_and_sort(mychoice);
                    }
                    result = options.scorer(proc_sorted_query, mychoice, options);
                }
                else if (tset) {
                    mychoice = "x"; //dummy string so it validates
                    if (choices[c].tokens) options.tokens = [query_tokens, choices[c].tokens];
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                        options.tokens = [query_tokens, tokenize(mychoice)]
                    }
                    //query and mychoice only used for validation here
                    result = options.scorer(query, mychoice, options);
                }
                else if (isCustom) {
                    // options.full_process should be unmodified, don't pre-process here since mychoice maybe not string
                    mychoice = options.processor(choices[c]);
                    result = options.scorer(query, mychoice, options);
                }
                else {
                    mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                    if (typeof mychoice !== "string" || mychoice.length === 0) anyblank = true;
                    result = options.scorer(query, mychoice, options);
                }
                if (isArray) idx = parseInt(c);
                else idx = c;
                if (result > options.cutoff) results.push([choices[c], result, idx]);
            }
            if (isArray && c < choices.length - 1) {
                setImmediate(function () { searchLoop(c + 1) })
            }
            else if (i < keys.length - 1) {
                setImmediate(function () { searchLoop(keys[i + 1], i + 1) });
            }
            else {
                if (anyblank) console.log("One or more choices were empty. (post-processing if applied)")
                if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices && !options.unsorted) {
                    var cmp = function (a, b) { return a[1] - b[1]; }
                    results = Heap.nlargest(results, options.limit, cmp);
                }
                else if (!options.unsorted) {
                    results = results.sort(function (a, b) { return b[1] - a[1]; });
                }
                callback(results);
            }
        }
    }

/** Main Scoring Code */

    function _token_set(str1, str2, options) {

        if (!options.tokens) {
            var tokens1 = tokenize(str1);
            var tokens2 = tokenize(str2);
        }
        else {
            var tokens1 = options.tokens[0];
            var tokens2 = options.tokens[1];
        }

        var intersection = _intersect(tokens1, tokens2);
        var diff1to2 = _difference(tokens1, tokens2);
        var diff2to1 = _difference(tokens2, tokens1);

        var sorted_sect = intersection.sort().join(" ");
        var sorted_1to2 = diff1to2.sort().join(" ");
        var sorted_2to1 = diff2to1.sort().join(" ");
        var combined_1to2 = sorted_sect + " " + sorted_1to2;
        var combined_2to1 = sorted_sect + " " + sorted_2to1;
        
        sorted_sect = sorted_sect.trim();
        combined_1to2 = combined_1to2.trim();
        combined_2to1 = combined_2to1.trim();
        var ratio_func = _ratio;
        //if (options.partial) ratio_func = _partial_ratio;

        var pairwise = [
            ratio_func(sorted_sect, combined_1to2, options),
            ratio_func(sorted_sect, combined_2to1, options),
            ratio_func(combined_1to2, combined_2to1, options)
        ]
        return Math.max.apply(null, pairwise);
    }

    function _ratio(str1, str2, options) {
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        //to match behavior of python-Levenshtein/fuzzywuzzy, substitution cost is 2 if not specified, or would default to 1
        if (typeof options.subcost === "undefined") options.subcost = 2;
        var levdistance, lensum;
        if (options.astral) {
            levdistance = _iLeven(str1, str2, options);
            lensum = _toArray(str1).length + _toArray(str2).length
        }
        else {
            levdistance = _leven(str1, str2, options);
            lensum = str1.length + str2.length;
        }
        return Math.round(100 * ((lensum - levdistance) / lensum));
    }

    function process_and_sort(str) {
        return str.match(/\S+/g).sort().join(" ").trim();
    }

     function tokenize(str) {
        return _uniq(str.match(/\S+/g));
    }

    /** from https://github.com/hiddentao/fast-levenshtein slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */

    // arrays to re-use

    var collator;
    try {
        collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
    } catch (err) {
        console.log("Collator could not be initialized and wouldn't be used");
    }

    // testing if faster than fast-levenshtein..
    /** from https://github.com/sindresorhus/leven slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */
    var arr = [];
    var charCodeCache = [];

    var _leven = function (a, b, options) {
        var useCollator = (options && collator && options.useCollator);
        var subcost = 1;
        //to match behavior of python-Levenshtein and fuzzywuzzy
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
                    //tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + subcost;
                    tmp = arr[i];
                    ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
                }
            }
        }
        return ret;
    };

    var _iLeven = function (a, b, options) {
        var useCollator = (options && collator && options.useCollator);
        var subcost = 1;
        //to match behavior of python-Levenshtein and fuzzywuzzy
        if (options && options.subcost && typeof options.subcost === "number") subcost = options.subcost;

        if (a === b) {
            return 0;
        }
        var achars = _toArray(a);
        var bchars = _toArray(b);
        var aLen = achars.length;
        var bLen = bchars.length;

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
            charCodeCache[i] = achars[i].codePointAt(0);
            arr[i] = ++i;
        }
        if (!useCollator) {  //checking for collator inside while 2x slower
            while (j < bLen) {
                bCharCode = bchars[j].codePointAt(0);
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
                bCharCode = bchars[j].codePointAt(0);
                tmp = j++;
                ret = j;

                for (i = 0; i < aLen; i++) {
                    tmp2 = 0 === collator.compare(String.fromCodePoint(bCharCode), String.fromCodePoint(charCodeCache[i])) ? tmp : tmp + subcost;
                    tmp = arr[i];
                    ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
                }
            }
        }
        return ret;
    };


/**    Utils   */

    function _validate(str) {
        if ((typeof str === "string" || str instanceof String) && str.length > 0) return true;
        else return false;
    }

    function full_process(str, force_ascii) {
        if (!(str instanceof String) && typeof str !== "string") return "";
        // Non-ascii won't turn into whitespace if force_ascii
        if (force_ascii !== false) str = str.replace(/[^\x00-\x7F]/g, "");
        // Non-alphanumeric (roman alphabet) to whitespace
        return str.replace(/\W|_/g,' ').toLowerCase().trim();
    }

    // clone/shallow copy whatev
    function _clone_and_set_option_defaults(options) {
        // don't run more than once if usign extract functions
        if(options && options.isAClone) return options;
        var optclone = {isAClone: true};
        if (options) {
            var i, keys = Object.keys(options);
            for (i = 0; i < keys.length; i++) {
                optclone[keys[i]] = options[keys[i]];
            }
        }
        if (!(typeof optclone.full_process !== 'undefined' && optclone.full_process === false)) optclone.full_process = true;
        if (!(typeof optclone.force_ascii !== 'undefined' && optclone.force_ascii === false)) optclone.force_ascii = true ;
        return optclone;
    }

    function _isCustomFunc(func) {
        if (typeof func === "function" && (
            func.name === "token_set_ratio" ||
            func.name === "partial_token_set_ratio" ||
            func.name === "token_sort_ratio" ||
            func.name === "partial_token_sort_ratio" ||
            func.name === "QRatio" ||
            func.name === "WRatio" ||
            func.name === "distance" ||
            func.name === "partial_ratio"
        )) {
            return false;
        }
        else {
            return true;
        }
    }

    //polyfill for Object.keys
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        } ());
    }
    // isArray polyfill
    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    };

    var fuzzball = {
        distance: distance,
        ratio: QRatio,
        token_set_ratio: token_set_ratio,
        token_sort_ratio: token_sort_ratio,
        full_process: full_process,
        extract: extract,
        extractAsync: extractAsync,
        process_and_sort: process_and_sort,
        unique_tokens: tokenize
    };

     module.exports = fuzzball;
} ());

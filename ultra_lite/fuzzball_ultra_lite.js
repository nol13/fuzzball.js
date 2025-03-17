(function () {
    /** @module fuzzball */
    'use strict';
    
    var nativeUtils = require('../lib/native_utils.js');
    var _intersect = nativeUtils._intersect;
    var _difference = nativeUtils._difference;
    var _uniq = nativeUtils._uniq;
    
    var leven = require('../lib/leven');

    var utils = require('../lib/utils_ultra_lite.js')(_uniq);
    var validate = utils.validate;
    var process_and_sort = utils.process_and_sort;
    var tokenize = utils.tokenize;
    var full_process = utils.full_process;
    var clone_and_set_option_defaults = utils.clone_and_set_option_defaults;
    var isCustomFunc = utils.isCustomFunc;
    if (typeof setImmediate !== 'function') { require('setimmediate'); } // didn't run in tiny-worker without extra check
    // isArray polyfill
    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    };

/** Mostly follows after python fuzzywuzzy, https://github.com/seatgeek/fuzzywuzzy */


/** Public functions */

    function distance(str1, str2, options_p) {
        /**
         * Calculate levenshtein distance of the two strings.
         *
         * @function distance
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @returns {number} - the levenshtein distance (0 and above).
         */
        var options = clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        return leven(str1, str2, options); // falls back to leven if no wildcards
    }

    function QRatio(str1, str2, options_p) {
        /**
         * Calculate levenshtein ratio of the two strings.
         *
         * @function ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!validate(str1)) return 0;
        if (!validate(str2)) return 0;
        return _ratio(str1, str2, options);
    }

    function token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate token set ratio of the two strings.
         *
         * @function token_set_ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!validate(str1)) return 0;
        if (!validate(str2)) return 0;
        return _token_set(str1, str2, options);
    }

    function token_sort_ratio(str1, str2, options_p) {
        /**
         * Calculate token sort ratio of the two strings.
         *
         * @function token_sort_ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!validate(str1)) return 0;
        if (!validate(str2)) return 0;
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
         * @param {function} [options_p.scorer] - takes two values and returns a score
         * @param {function} [options_p.processor] - takes each choice and outputs a value to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suited
         * @param {boolean} [options_p.returnObjects] - return array of object instead of array of tuples; default false
         * @returns {Object[]} - array of choice results with their computed ratios (0-100).
         */
        var options = clone_and_set_option_defaults(options_p);
        var isArray = false;
        var numchoices;
        if (choices && choices.length && Array.isArray(choices)) {
            numchoices = choices.length;
            isArray = true; //if array don't check hasOwnProperty every time below
        }
        else if (!(choices instanceof Object)) {
            throw new Error("Invalid choices");
        }
        else numchoices = Object.keys(choices).length;
        if (!choices || numchoices === 0) {
            if (typeof console !== undefined) console.warn("No choices");
            return [];
        }
        if (options.processor && typeof options.processor !== "function") {
            throw new Error("Invalid Processor");
        }
        if (!options.processor) options.processor = function (x) { return x; }
        if (options.scorer && typeof options.scorer !== "function") {
            throw new Error("Invalid Scorer");
        }
        if (!options.scorer) {
            options.scorer = QRatio;
        }
        var isCustom = isCustomFunc(options.scorer); // check if func name is one of fuzzball's, so don't use same names..
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1;}
        var pre_processor = function(choice, force_ascii) {return choice;}
        if (options.full_process) {
            pre_processor = full_process;
            if (!isCustom) options.processed = true; // to let wildcardLeven know and not run again after we set fp to false below
        }
        if (!isCustom) { // if custom scorer func let scorer handle it
            query = pre_processor(query, options);
            options.full_process = false;
            if (query.length === 0) if (typeof console !== undefined) console.warn("Processed query is empty string");
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
        var idx, mychoice, result, cmpSort;
        if (options.returnObjects) {
            cmpSort = function (a, b) { return b.score - a.score; };
        }
        else {
            cmpSort = function (a, b) { return b[1] - a[1]; };
        }
        for (var c in choices) {
            if (isArray || choices.hasOwnProperty(c)) {
                options.tokens = undefined;
                options.proc_sorted = false;
                if (tsort) {
                    options.proc_sorted = true;
                    if (choices[c] && choices[c].proc_sorted) mychoice = choices[c].proc_sorted;
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options);
                        mychoice = process_and_sort(mychoice);
                    }
                    result = options.scorer(proc_sorted_query, mychoice, options);
                }
                else if (tset) {
                    mychoice = "x"; //dummy string so it validates
                    if (choices[c] && choices[c].tokens) {
                        options.tokens = [query_tokens, choices[c].tokens];
                        if (options.trySimple) mychoice = pre_processor(options.processor(choices[c]), options);
                    }
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options);
                        options.tokens = [query_tokens, tokenize(mychoice)]
                    }
                    //query and mychoice only used for validation here unless trySimple = true
                    result = options.scorer(query, mychoice, options);
                }
                else if (isCustom) {
                    // options.full_process should be unmodified, don't pre-process here since mychoice maybe not string
                    mychoice = options.processor(choices[c]);
                    result = options.scorer(query, mychoice, options);
                }
                else {
                    mychoice = pre_processor(options.processor(choices[c]), options);
                    if (typeof mychoice !== "string" || mychoice.length === 0) anyblank = true;
                    result = options.scorer(query, mychoice, options);
                }
                if (isArray) idx = parseInt(c);
                else idx = c;
                if (result > options.cutoff) {
                    if (options.returnObjects) results.push({ choice: choices[c], score: result, key: idx });
                    else results.push([choices[c], result, idx]);;
                }
            }
        }
        if (anyblank) if (typeof console !== undefined) console.log("One or more choices were empty. (post-processing if applied)")
        if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices && !options.unsorted) {
            results = results.sort(cmpSort).slice(0, options.limit);
        }
        else if (!options.unsorted) {
            results = results.sort(cmpSort);
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
         * @param {function} [options_p.scorer] - takes two values and returns a score
         * @param {function} [options_p.processor] - takes each choice and outputs a value to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suite
         * @param {boolean} [options_p.returnObjects] - return array of object instead of array of tuples; default false
         * @param {Object} [options_p.abortController] - track abortion
         * @param {Object} [options_p.cancelToken] - track cancellation
         * @param {number} [options_p.asyncLoopOffset] - number of rows to run in between every async loop iteration, default 256
         * @param {function} callback - node style callback (err, arrayOfResults)
         */
        var options = clone_and_set_option_defaults(options_p);

        var abortController;
        if (typeof options_p.abortController === "object") {
            abortController = options_p.abortController;
        }

        var cancelToken;
        if (typeof options_p.cancelToken === "object") {
            cancelToken = options_p.cancelToken;
        }

        var loopOffset = 256;
        if (typeof options.asyncLoopOffset === 'number') {
            if (options.asyncLoopOffset < 1) loopOffset = 1;
            else loopOffset = options.asyncLoopOffset;
        }

        var isArray = false;
        var numchoices;
        if (choices && choices.length && Array.isArray(choices)) {
            numchoices = choices.length;
            isArray = true; //if array don't check hasOwnProperty every time below
        }
        else if (!(choices instanceof Object)) {
            callback(new Error("Invalid choices"));
            return;
        }
        else numchoices = Object.keys(choices).length;
        if (!choices || numchoices === 0) {
            if (typeof console !== undefined) console.warn("No choices");
            callback(null, []);
            return;
        }
        if (options.processor && typeof options.processor !== "function") {
            callback(new Error("Invalid Processor"));
            return;
        }
        if (!options.processor) options.processor = function (x) { return x; }
        if (options.scorer && typeof options.scorer !== "function") {
            callback(new Error("Invalid Scorer"));
            return;
        }
        if (!options.scorer) {
            options.scorer = QRatio;
        }
        var isCustom = isCustomFunc(options.scorer); // check if func name is one of fuzzball's, so don't use same names..
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1; }
        var pre_processor = function (choice, force_ascii) { return choice; }
        if (options.full_process) {
            pre_processor = full_process;
            if (!isCustom) options.processed = true; // to let wildcardLeven know and not run again after we set fp to false below
        }
        if (!isCustom) { // if custom scorer func let scorer handle it
            query = pre_processor(query, options);
            options.full_process = false;
            if (query.length === 0) if (typeof console !== undefined) console.warn("Processed query is empty string");
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
        var idx, mychoice, result, cmpSort;
        if (options.returnObjects) {
            cmpSort = function (a, b) { return b.score - a.score; };
        }
        else {
            cmpSort = function (a, b) { return b[1] - a[1]; };
        }
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
                        mychoice = pre_processor(options.processor(choices[c]), options);
                        mychoice = process_and_sort(mychoice);
                    }
                    result = options.scorer(proc_sorted_query, mychoice, options);
                }
                else if (tset) {
                    mychoice = "x"; //dummy string so it validates
                    if (choices[c].tokens) {
                        options.tokens = [query_tokens, choices[c].tokens];
                        if (options.trySimple) mychoice = pre_processor(options.processor(choices[c]), options);
                    }
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options);
                        options.tokens = [query_tokens, tokenize(mychoice)]
                    }
                    //query and mychoice only used for validation here unless trySimple = true
                    result = options.scorer(query, mychoice, options);
                }
                else if (isCustom) {
                    // options.full_process should be unmodified, don't pre-process here since mychoice maybe not string
                    mychoice = options.processor(choices[c]);
                    result = options.scorer(query, mychoice, options);
                }
                else {
                    mychoice = pre_processor(options.processor(choices[c]), options);
                    if (typeof mychoice !== "string" || mychoice.length === 0) anyblank = true;
                    result = options.scorer(query, mychoice, options);
                }
                if (isArray) idx = parseInt(c);
                else idx = c;
                if (result > options.cutoff) {
                    if (options.returnObjects) results.push({ choice: choices[c], score: result, key: idx });
                    else results.push([choices[c], result, idx]);;
                }
            }

            if (abortController && abortController.signal.aborted === true) {
                callback(new Error("aborted"));
                return;
            }

            if (cancelToken && cancelToken.canceled === true) {
                callback(new Error("canceled"));
                return;
            }

            if (isArray && c < choices.length - 1) {
                if (c % loopOffset === 0) { setImmediate(function () { searchLoop(c + 1); }); }
                else searchLoop(c + 1);
            }
            else if (i < keys.length - 1) {
                if (i % loopOffset === 0) { setImmediate(function () { searchLoop(keys[i + 1], i + 1); }); }
                else { searchLoop(keys[i + 1], i + 1); }
            }
            else {
                if (anyblank) if (typeof console !== undefined) console.log("One or more choices were empty. (post-processing if applied)")
                if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices && !options.unsorted) {
                    results = results.sort(cmpSort).slice(0, options.limit);
                }
                else if (!options.unsorted) {
                    results = results.sort(cmpSort);
                }
                callback(null, results);
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

        var pairwise = [
            ratio_func(sorted_sect, combined_1to2, options),
            ratio_func(sorted_sect, combined_2to1, options),
            ratio_func(combined_1to2, combined_2to1, options)
        ]
        if (options.trySimple) {
            pairwise.push(ratio_func(str1, str2, options));
        }
        return Math.max.apply(null, pairwise);
    }

    function _ratio(str1, str2, options) {
        if (!validate(str1)) return 0;
        if (!validate(str2)) return 0;
        //to match behavior of python-Levenshtein/fuzzywuzzy, substitution cost is 2
        var levdistance, lensum;
        if (typeof options.subcost === "undefined") options.subcost = 2;
        levdistance = leven(str1, str2, options);
        lensum = str1.length + str2.length;
        return Math.round(100 * ((lensum - levdistance) / lensum));
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

    var extractAsPromised = undefined;
    if (typeof Promise !== 'undefined') {
        extractAsPromised = function (query, choices, options) {
            return new Promise(function (resolve, reject) {
                extractAsync(query, choices, options, function (err, response) {
                    if (err) reject(err);
                    else resolve(response);
                });
            });
        };
    }

    var fuzzball = {
        distance: distance,
        ratio: QRatio,
        token_set_ratio: token_set_ratio,
        token_sort_ratio: token_sort_ratio,
        full_process: full_process,
        extract: extract,
        extractAsync: extractAsync,
        extractAsPromised: extractAsPromised,
        process_and_sort: process_and_sort,
        unique_tokens: tokenize
    };

     module.exports = fuzzball;
} ());

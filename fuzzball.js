(function () {
    /** @module fuzzball */
    'use strict';
    var difflib = require('difflib');
    var Heap = require('heap');

    var _intersect = require('./lib/lodash.custom.min.js').intersection;
    var _intersectWith = require('./lib/lodash.custom.min.js').intersectionWith;
    var _difference = require('./lib/lodash.custom.min.js').difference;
    var _differenceWith = require('./lib/lodash.custom.min.js').differenceWith;
    var _uniq = require('./lib/lodash.custom.min.js').uniq;
    var _uniqWith = require('./lib/lodash.custom.min.js').uniqWith;
    var _partialRight = require('./lib/lodash.custom.min.js').partialRight;
    var _forEach = require('./lib/lodash.custom.min.js').forEach;
    var _keys = require('./lib/lodash.custom.min.js').keys;
    var _isArray = require('./lib/lodash.custom.min.js').isArray;
    var _toArray = require('./lib/lodash.custom.min.js').toArray;

    var _iLeven = require('./lib/iLeven.js');
    var _wildLeven = require('./lib/wildcardLeven.js');
    var _leven = require('./lib/leven.js');
    var _jsleven = require('./lib/jsleven');

    if (typeof setImmediate !== 'function') require('setimmediate'); // didn't run in tiny-worker without extra check

    var utils = require('./lib/utils.js')(_uniq, _uniqWith, _partialRight);
    var _validate = utils.validate;
    var process_and_sort = utils.process_and_sort;
    var tokenize = utils.tokenize;
    var full_process = utils.full_process;
    var _clone_and_set_option_defaults = utils.clone_and_set_option_defaults;
    var _isCustomFunc = utils.isCustomFunc;

    var processing = require('./lib/process.js')(_clone_and_set_option_defaults, _isArray, QRatio, extract);

    var dedupe = processing.dedupe;

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
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein distance (0 and above).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (typeof options.subcost === "undefined") options.subcost = 1;
        if (options.astral) return _iLeven(str1, str2, options, _toArray);
        else return _wildLeven(str1, str2, options, _leven); // falls back to _leven if no wildcards
    }

    function QRatio(str1, str2, options_p) {
        /**
         * Calculate levenshtein ratio of the two strings.
         *
         * @function ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _ratio(str1, str2, options);
    }

    function partial_ratio(str1, str2, options_p) {
        /**
         * Calculate partial levenshtein ratio of the two strings.
         *
         * @function partial_ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _partial_ratio(str1, str2, options);
    }

    function token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate token set ratio of the two strings.
         *
         * @function token_set_ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suite
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _token_set(str1, str2, options);
    }

    function partial_token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate partial token ratio of the two strings.
         *
         * @function partial_token_set_ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suite
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        options.partial = true;
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
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        if (!options.proc_sorted) {
            str1 = process_and_sort(str1);
            str2 = process_and_sort(str2);
        }
        return _ratio(str1, str2, options);
    }

    function partial_token_sort_ratio(str1, str2, options_p) {
        /**
         * Calculate partial token sort ratio of the two strings.
         *
         * @function partial_token_sort_ratio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        options.partial = true;
        if (!options.proc_sorted) {
            str1 = process_and_sort(str1);
            str2 = process_and_sort(str2);
        }
        return _partial_ratio(str1, str2, options);
    }

    function WRatio(str1, str2, options_p) {
        /**
         * Calculate weighted ratio of the two strings, taking best score of various methods.
         *
         * @function WRatio
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        //str1 = full_process(str1, options);  //fuzzywuzzy runs no matter what, reason? going by options.full_process
        //str2 = full_process(str2, options);
        str1 = options.full_process ? full_process(str1, options) : str1;
        str2 = options.full_process ? full_process(str2, options) : str2;
        options.full_process = false;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;

        var try_partial = true;
        var unbase_scale = .95;
        var partial_scale = .90;

        var base = _ratio(str1, str2, options);
        var len_ratio = Math.max(str1.length, str2.length)/Math.min(str1.length, str2.length);

        if (len_ratio < 1.5) try_partial = false;
        if (len_ratio > 8) partial_scale = .6;

        if (try_partial) {
            var partial = _partial_ratio(str1, str2, options) * partial_scale;
            var ptsor = partial_token_sort_ratio(str1, str2, options) * unbase_scale * partial_scale;
            var ptser = partial_token_set_ratio(str1, str2, options) * unbase_scale * partial_scale;
            return Math.round(Math.max(base, partial, ptsor, ptser));
        }
        else {
            var tsor = token_sort_ratio(str1, str2, options) * unbase_scale;
            var tser = token_set_ratio(str1, str2, options) * unbase_scale;
            return Math.round(Math.max(base, tsor, tser));
        }
    }

    function extract(query, choices, options_p) {
        /**
         * Return the top scoring items from an array (or assoc array) of choices
         *
         * @function extract
         * @param query - the search term.
         * @param {String[]|Object[]|Object} choices - array of strings, or array of choice objects if processor is supplied, or object of form {key: choice}
         * @param {Object} [options_p] - Additional options.
         * @param {function} [options_p.scorer] - takes two values and returns a score, will be passed options as 3rd argument
         * @param {function} [options_p.processor] - takes each choice and outputs a value to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suite
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {boolean} [options_p.returnObjects] - return array of object instead of array of tuples; default false
         * @returns {Array[] | Object[]} - array of choice results with their computed ratios (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        var numchoices;
        if (_isArray(choices)) {
            numchoices = choices.length;
        }
        else if (!(choices instanceof Object)) {
            throw new Error("Invalid choices");
        }
        else numchoices = _keys(choices).length;
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
            if (typeof console !== undefined) console.log("Using default scorer 'ratio'");
        }
        var isCustom = _isCustomFunc(options.scorer); // check if func name is one of fuzzball's, so don't use same names..
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1;}
        var pre_processor = function(choice, force_ascii) {return choice;}
        if (options.full_process) {
            pre_processor = full_process;
            if (!isCustom) options.processed = true; // to let wildcardLeven know and not run again after we set fp to false below
        }
        var normalize = false;
        if (!isCustom) { // if custom scorer func let scorer handle it
            query = pre_processor(query, options);
            options.full_process = false;
            if (options.astral && options.normalize) {
                options.normalize = false;  // don't normalize again in ratio if doing here
                if (String.prototype.normalize) {
                    normalize = true
                    query = query.normalize();
                }
                else {
                    if (typeof console !== undefined) console.warn("Normalization not supported in your environment");
                }
            }
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
            var query_tokens = tokenize(query, options);
            tset = true;
        }

        var result, mychoice, cmpHeap, cmpSort;
        if (options.returnObjects) {
            cmpHeap = function (a, b) { return a.score - b.score; };
            cmpSort = function (a, b) { return b.score - a.score; };
        }
        else {
            cmpHeap = function (a, b) { return a[1] - b[1]; };
            cmpSort = function (a, b) { return b[1] - a[1]; };
        }
        _forEach(choices, function (value, key) {
            options.tokens = undefined;
            options.proc_sorted = false;
            if (tsort) {
                options.proc_sorted = true;
                if (value && value.proc_sorted) mychoice = value.proc_sorted;
                else {
                    mychoice = pre_processor(options.processor(value), options);
                    mychoice = process_and_sort(normalize ? mychoice.normalize() : mychoice);
                }
                result = options.scorer(proc_sorted_query, mychoice, options);
            }
            else if (tset) {
                mychoice = "x"; //dummy string so it validates, if either tokens is [] all 3 tests will still be 0
                if (value && value.tokens) {
                    options.tokens = [query_tokens, value.tokens];
                    if (options.trySimple) mychoice = pre_processor(options.processor(value), options);
                }
                else {
                    mychoice = pre_processor(options.processor(value), options);
                    options.tokens = [query_tokens, tokenize((normalize ? mychoice.normalize() : mychoice), options)]
                }
                //query and mychoice only used for validation here unless trySimple = true
                result = options.scorer(query, mychoice, options);
            }
            else if (isCustom) {
                // options.full_process should be unmodified, don't pre-process here since mychoice maybe not string
                mychoice = options.processor(value);
                result = options.scorer(query, mychoice, options);
            }
            else {
                mychoice = pre_processor(options.processor(value), options);
                if (typeof mychoice !== "string" || mychoice.length === 0) anyblank = true;
                if (normalize && typeof mychoice === "string") mychoice = mychoice.normalize();
                result = options.scorer(query, mychoice, options);
            }
            if (result > options.cutoff) {
                if (options.returnObjects) results.push({choice: value, score: result, key: key});
                else results.push([value, result, key]);
            }
        });

        if (anyblank) if (typeof console !== undefined) console.log("One or more choices were empty. (post-processing if applied)")
        if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices && !options.unsorted) {
            results = Heap.nlargest(results, options.limit, cmpHeap);
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
         * @function extractAsync
         * @param query - the search term.
         * @param {String[]|Object[]|Object} choices - array of strings, or array of choice objects if processor is supplied, or object of form {key: choice}
         * @param {Object} [options_p] - Additional options.
         * @param {function} [options_p.scorer] - takes two values and returns a score, will be passed options as 3rd argument
         * @param {function} [options_p.processor] - takes each choice and outputs a value to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {number} [options_p.astral] - Use astral aware calculation
         * @param {string} [options_p.normalize] - Normalize unicode representations
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false
         * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
         * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suite
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
         * @param {boolean} [options_p.returnObjects] - return array of object instead of array of tuples; default false
         * @param {function} callback - node style callback (err, arrayOfResults)
         */
        var options = _clone_and_set_option_defaults(options_p);

        var isArray = false;
        var numchoices;
        if (choices && choices.length && _isArray(choices)) {
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
            if (typeof console !== undefined) console.log("Using default scorer 'ratio'");
        }
        var isCustom = _isCustomFunc(options.scorer); // check if func name is one of fuzzball's, so don't use same names..
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1; }
        var pre_processor = function (choice, force_ascii) { return choice; }
        if (options.full_process) {
            pre_processor = full_process;
            if (!isCustom) options.processed = true; // to let wildcardLeven know and not run again after we set fp to false below
        }
        var normalize = false;
        if (!isCustom) { // if custom scorer func let scorer handle it
            query = pre_processor(query, options);
            options.full_process = false;
            if (options.astral && options.normalize) {
                options.normalize = false;  // don't normalize again in ratio if doing here
                if (String.prototype.normalize) {
                    normalize = true
                    query = query.normalize();
                }
                else {
                    if (typeof console !== undefined) console.warn("Normalization not supported in your environment");
                }
            }
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
            var query_tokens = tokenize(query, options);
            tset = true;
        }
        var idx, mychoice, result, cmpHeap, cmpSort;
        if (options.returnObjects) {
            cmpHeap = function (a, b) { return a.score - b.score; };
            cmpSort = function (a, b) { return b.score - a.score; };
        }
        else {
            cmpHeap = function (a, b) { return a[1] - b[1]; };
            cmpSort = function (a, b) { return b[1] - a[1]; };
        }
        var keys = Object.keys(choices);
        isArray ? searchLoop(0) : searchLoop(keys[0], 0);
        function searchLoop(c, i) {
            if (isArray || choices.hasOwnProperty(c)) {
                options.tokens = undefined;
                options.proc_sorted = false;
                if (tsort) {
                    options.proc_sorted = true;
                    if (choices[c] && choices[c].proc_sorted) mychoice = choices[c].proc_sorted;
                    else {
                        mychoice = pre_processor(options.processor(choices[c]), options);
                        mychoice = process_and_sort(normalize ? mychoice.normalize() : mychoice);
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
                        options.tokens = [query_tokens, tokenize((normalize ? mychoice.normalize() : mychoice), options)]
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
                    if (normalize && typeof mychoice === "string") mychoice = mychoice.normalize();
                    result = options.scorer(query, mychoice, options);
                }
                if (isArray) idx = parseInt(c);
                else idx = c;
                if (result > options.cutoff) {
                    if (options.returnObjects) results.push({ choice: choices[c], score: result, key: idx });
                    else results.push([choices[c], result, idx]);
                }
            }
            if (isArray && c < choices.length - 1) {
                setImmediate(function () { searchLoop(c + 1) })
            }
            else if (i < keys.length - 1) {
                setImmediate(function () { searchLoop(keys[i + 1], i + 1) });
            }
            else {
                if (anyblank) if (typeof console !== undefined) console.log("One or more choices were empty. (post-processing if applied)")
                if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices && !options.unsorted) {
                    results = Heap.nlargest(results, options.limit, cmpHeap);
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

        var partWild = _partialRight(_wildLeven, options, _leven);
        var wildCompare = function (a, b) { return partWild(a, b) === 0; }

        if (!options.tokens) {
            var tokens1 = tokenize(str1, options);
            var tokens2 = tokenize(str2, options);
        }
        else {
            var tokens1 = options.tokens[0];
            var tokens2 = options.tokens[1];
        }

        if (options.wildcards) {
            var intersection = _intersectWith(tokens1, tokens2, wildCompare);
            var diff1to2 = _differenceWith(tokens1, tokens2, wildCompare);
            var diff2to1 = _differenceWith(tokens2, tokens1, wildCompare);
        }
        else {
            var intersection = _intersect(tokens1, tokens2);
            var diff1to2 = _difference(tokens1, tokens2);
            var diff2to1 = _difference(tokens2, tokens1);
        }

        var sorted_sect = intersection.sort().join(" ");
        var sorted_1to2 = diff1to2.sort().join(" ");
        var sorted_2to1 = diff2to1.sort().join(" ");
        var combined_1to2 = sorted_sect + " " + sorted_1to2;
        var combined_2to1 = sorted_sect + " " + sorted_2to1;

        sorted_sect = sorted_sect.trim();
        combined_1to2 = combined_1to2.trim();
        combined_2to1 = combined_2to1.trim();
        var ratio_func = _ratio;
        if (options.partial) {
            ratio_func = _partial_ratio;
            if (sorted_sect.length > 0) return 100; // will always be 100 anyway
        }

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

    var normalWarn = false;
    function _ratio(str1, str2, options) {
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        if (options.ratio_alg && options.ratio_alg === "difflib") {
            var m = new difflib.SequenceMatcher(null, str1, str2);
            var r = m.ratio();
            return Math.round(100 * r);
        }
        //to match behavior of python-Levenshtein/fuzzywuzzy, substitution cost is 2 if not specified, or would default to 1
        if (typeof options.subcost === "undefined") options.subcost = 2;
        var levdistance, lensum;
        if (options.astral) {
            if (options.normalize) {
                if (String.prototype.normalize) {
                    str1 = str1.normalize();
                    str2 = str2.normalize();
                }
                else {
                    if (!normalWarn) {
                        if (typeof console !== undefined) console.warn("Normalization not supported in your environment");
                        normalWarn = true;
                    }
                }
            }
            levdistance = _iLeven(str1, str2, options, _toArray);
            lensum = _toArray(str1).length + _toArray(str2).length
        }
        else {
            if (!options.wildcards && !options.useCollator && options.subcost === 2) {
                levdistance = _jsleven(str1, str2);
                lensum = str1.length + str2.length;
            }
            else if (!options.wildcards) {
                levdistance = _leven(str1, str2, options);
                lensum = str1.length + str2.length;
            }
            else {
                levdistance = _wildLeven(str1, str2, options, _leven); // falls back to _leven if invalid
                lensum = str1.length + str2.length;
            }
        }
        return Math.round(100 * ((lensum - levdistance)/lensum));
    }

    function _partial_ratio(str1, str2, options) {
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        if (str1.length <= str2.length) {
            var shorter = str1
            var longer = str2
        }
        else {
            var shorter = str2
            var longer = str1
        }
        var m = new difflib.SequenceMatcher(null, shorter, longer);
        var blocks = m.getMatchingBlocks();
        var scores = [];
        for (var b = 0; b < blocks.length; b++) {
            var long_start = (blocks[b][1] - blocks[b][0]) > 0 ? (blocks[b][1] - blocks[b][0]) : 0;
            var long_end = long_start + shorter.length;
            var long_substr = longer.substring(long_start,long_end);
            var r = _ratio(shorter,long_substr,options);
            if (r > 99.5) return 100;
            else scores.push(r);
        }
        return Math.max.apply(null, scores);
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

    var fuzzball = {
        distance: distance,
        ratio: QRatio,
        partial_ratio: partial_ratio,
        token_set_ratio: token_set_ratio,
        token_sort_ratio: token_sort_ratio,
        partial_token_set_ratio: partial_token_set_ratio,
        partial_token_sort_ratio: partial_token_sort_ratio,
        WRatio: WRatio,
        full_process: full_process,
        extract: extract,
        extractAsync: extractAsync,
        process_and_sort: process_and_sort,
        unique_tokens: tokenize,
        dedupe: dedupe
    };

     module.exports = fuzzball;
} ());

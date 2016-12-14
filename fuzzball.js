(function () {
    'use strict';
    var difflib = require('difflib');
/** Mostly follows after python fuzzywuzzy, https://github.com/seatgeek/fuzzywuzzy */


/** Public functions */

    function distance(str1, str2, options_p) {
        /**
         * Calculate levenshtein distance of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein distance (0 and above).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (typeof options.subcost === "undefined") options.subcost = 1;
        return _lev_distance(str1, str2, options);
    }

    function QRatio(str1, str2, options_p) {
        /**
         * Calculate levenshtein ratio of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _ratio(str1, str2, options);
    }

    function partial_ratio(str1, str2, options_p) {
        /**
         * Calculate partial levenshtein ratio of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _partial_ratio(str1, str2, options);
    }

    function token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate token set ratio of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _token_set(str1, str2, options);
    }

    function partial_token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate partial token ratio of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        options.partial = true;
        return _token_set(str1, str2, options);
    }

    function token_sort_ratio(str1, str2, options_p) {
        /**
         * Calculate token sort ratio of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        str1 = _process_and_sort(str1);
        str2 = _process_and_sort(str2);
        return _ratio(str1, str2, options);
    }

    function partial_token_sort_ratio(str1, str2, options_p) {
        /**
         * Calculate partial token sort ratio of the two strings.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        str1 = _process_and_sort(str1);
        str2 = _process_and_sort(str2);
        return _partial_ratio(str1, str2, options);
    }

    function WRatio(str1, str2, options_p) {
        /**```js
fuzz.ratio("this is a test", "this is a test!")
        100
```
         * Calculate weighted ratio of the two strings, taking best score of various methods.
         *
         * @param str1 String the first string.
         * @param str2 String the second string.
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = full_process(str1, options.force_ascii);
        str2 = full_process(str2, options.force_ascii);
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
            var partial = _partial_ratio(str1, str2) * partial_scale;
            var ptsor = partial_token_sort_ratio(str1, str2, options) * unbase_scale * partial_scale;
            var ptser = partial_token_set_ratio(str1, str2, options) * unbase_scale * partial_scale;
            return Math.max(base, tsor, tser);
        }
        else {
            var tsor = token_sort_ratio(str1, str2, options) * unbase_scale;
            var tser = token_sort_ratio(str1, str2, options) * unbase_scale;
            return Math.max(base, tsor, tser);
        }
    }

    function extract(query, choices, scorer, processor, limit, cutoff, options_p) {
        /**
         * Return the top scoring items from an array of choices
         *
         * @param query String the search term.
         * @param choices [String] array of strings, or array of objects if processor is supplied
         * @param processor function (optional) that takes each choice and outputs a string to be used for Scoring
         * @param limit Integer (optional) max number of results to return, returns all if not supplied
         * @param cutoff Integer minimum score that will get returned
         * @param [options_p] Additional options.
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        query = options.full_process ? full_process(query, options.force_ascii) : query;
        if (query.length === 0) console.log("Processed query is empty string");
        if (!choices || choices.length === 0) console.log("No choices");
        if (processor && typeof processor !== "function") console.log("Invalid Processor");
        if (!processor) processor = function(x) {return x;}
        if (!scorer || typeof scorer !== "function") {
            scorer = QRatio;
            console.log("Using default scorer");
        }
        if (!cutoff || typeof cutoff !== "number") { cutoff = -1;}
        var pre_processor = function(choice, force_ascii) {return choice;}
        if (options.full_process) pre_processor = full_process;
        if (!limit || typeof limit !== "number") limit = choices.length;
        var results = [];
        var topscores = Array.apply(null, Array(limit)).map(Number.prototype.valueOf,0);
        for (var c = 0; c < choices.length; c++) {
            var mychoice = pre_processor(processor(choices[c]), options.force_ascii);
            var result = scorer(query, mychoice, options);
            if (result > cutoff) results.push([choices[c],result]); //prob don't need to build full list if a limit.. TODO: optimize?
        } 
        results = results.sort(function(a,b){return processor(b[1])-processor(a[1]);}); // using this for now..
        return results.slice(0, parseInt(limit));
    }

/** Main Scoring Code */

    function _lev_distance(str1, str2, options) {
        return fast_levenshtein(str1, str2, options);
    }

    function _token_set(str1, str2, options) {

        var tokens1 = str1.match(/\S+/g);
        var tokens2 = str2.match(/\S+/g);

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
        if (options.partial) ratio_func = _partial_ratio;

        var pairwise = [
            ratio_func(sorted_sect, combined_1to2, options),
            ratio_func(sorted_sect, combined_2to1, options),
            ratio_func(combined_1to2, combined_2to1, options)
        ]
        return Math.max.apply(null, pairwise);
    }

    function _ratio(str1, str2, options) {
        //to match behavior of python-Levenshtein/fuzzywuzzy, substitution cost is 1 if not specified
        if (typeof options.subcost === "undefined") options.subcost = 2;
        var levdistance = _lev_distance(str1, str2, options);
        var lensum = str1.length + str2.length ; //TODO: account for unicode double byte astral stuff
        return Math.round(100 * ((lensum - levdistance)/lensum));
    }

    function _partial_ratio(str1, str2, options) {
        if (str1.length > str2.length) {
            var shorter = str2
            var longer = str1
        }
        else {
            var shorter = str1
            var longer = str2
        }
        var m = new difflib.SequenceMatcher(null, shorter, longer);
        var blocks = m.getMatchingBlocks();
        var scores = [];

        for (var b = 0; b < blocks.length; b++) {
            var long_start = (blocks[1] - blocks[0]) > 0 ? (blocks[1] - blocks[0]) : 0;
            var long_end = long_start + shorter.length;
            var long_substr = longer.substring(long_start,long_end);
            var m2 = new difflib.SequenceMatcher(null, shorter, long_substr);
            var r = m2.ratio();
            if (r > 0.995) return 100;
            else scores.push(r);
        }
        return Math.round(100 * Math.max.apply(null, scores));
    }

    function _process_and_sort(str) {
        return str.match(/\S+/g).sort().join(" ").trim();
    }

    /** from https://github.com/hiddentao/fast-levenshtein slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */

    // arrays to re-use
    var prevRow = [], str2Char = [];

    function fast_levenshtein(str1, str2, options) {
        var useCollator = (options && collator && options.useCollator);
        var subcost = 1;
        //to match behavior of python-Levenshtein and fuzzywuzzy
        if (options.subcost && typeof options.subcost === "number") subcost = options.subcost;
        var str1Len = str1.length,
            str2Len = str2.length;

        // base cases
        if (str1Len === 0) return str2Len;
        if (str2Len === 0) return str1Len;

        // two rows
        var curCol, nextCol, i, j, tmp;

        // initialise previous row
        for (i = 0; i < str2Len; ++i) {
            prevRow[i] = i;
            str2Char[i] = str2.charCodeAt(i);
        }
        prevRow[str2Len] = str2Len;

        // calculate current row distance from previous row
        for (i = 0; i < str1Len; ++i) {
            nextCol = i + 1;

            for (j = 0; j < str2Len; ++j) {
                curCol = nextCol;

                // substution
                var strCmp = useCollator ? (0 === collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]))) : str1.charCodeAt(i) === str2Char[j];

                nextCol = prevRow[j] + (strCmp ? 0 : subcost);

                // insertion
                tmp = curCol + 1;
                if (nextCol > tmp) {
                    nextCol = tmp;
                }
                // deletion
                tmp = prevRow[j + 1] + 1;
                if (nextCol > tmp) {
                    nextCol = tmp;
                }

                // copy current col value into previous (in preparation for next iteration)
                prevRow[j] = curCol;
            }

            // copy last col value into previous (in preparation for next iteration)
            prevRow[j] = nextCol;
        }

        return nextCol;
    }

/**    Utils   */

    var collator;
    try {
        collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
    } catch (err) {
        console.log("Collator could not be initialized and wouldn't be used");
    }
    
    /**
     * from stackoverflow, of course. Question #1885557
     */
    function _intersect(a, b) {
    var d = {};
    var results = [];
    for (var i = 0; i < b.length; i++) {
        d[b[i]] = true;
    }
    for (var j = 0; j < a.length; j++) {
        if (d[a[j]]) 
            results.push(a[j]);
    }
    return results;
}

    function _difference(a, b) {
        return a.filter(function(x) { return b.indexOf(x) < 0 }); // TODO: faster implementation
    }

    function _validate(str) {
        if (typeof str === "string" && str.length > 0) return true;
        else return false;
    }

    function full_process(str, force_ascii) {
        if (typeof str !== "string") return "";
        // Non-ascii won't turn into whitespace if force_ascii
        if (force_ascii) str = str.replace(/[^\x00-\x7F]/g, "");
        // Non-alphanumeric (roman alphabet) to whitespace
        return str.replace(/\W|_/g,' ').toLowerCase().trim();
    }

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
        extract: extract        
    };

    // amd
    if (typeof define !== "undefined" && define !== null && define.amd) {
        define(function () {
            return fuzzball;
        });
    }
    // commonjs
    else if (typeof module !== "undefined" && module !== null && typeof exports !== "undefined" && module.exports === exports) {
        module.exports = fuzzball;
    }
    // web worker
    else if (typeof self !== "undefined" && typeof self.postMessage === 'function' && typeof self.importScripts === 'function') {
        self.fuzzball = fuzzball;
    }
    // browser main thread
    else if (typeof window !== "undefined" && window !== null) {
        window.fuzzball = fuzzball;
    }
} ());
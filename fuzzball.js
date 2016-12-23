(function () {
    'use strict';
    var difflib = require('difflib');
    var Heap = require('heap');
    var damlev = require('damlev');
    var _intersect = require('lodash.intersection');
    var _difference = require('lodash.difference');
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
        if (!options.proc_sorted) {
            str1 = _process_and_sort(str1);
            str2 = _process_and_sort(str2);
        }
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
        options.partial = true;
        if (!options.proc_sorted) {
            str1 = _process_and_sort(str1);
            str2 = _process_and_sort(str2);
        }
        return _partial_ratio(str1, str2, options);
    }

    function WRatio(str1, str2, options_p) {
        /**
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
         * Return the top scoring items from an array of choices
         *
         * @param query String the search term.
         * @param choices [String] array of strings, or array of objects if processor is supplied
         * @param [options_p] Additional options.
         * @param [options_p.scorer] function that takes two strings and returns a score
         * @param [options_p.processor] function that takes each choice and outputs a string to be used for Scoring
         * @param [options_p.limit] Integer (optional) max number of results to return, returns all if not supplied
         * @param [options_p.cutoff] Integer minimum score that will get returned
         * @param [options_p.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
         * @param [options_p.full_process] Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param [options_p.force_ascii] Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param [options_p.subcost] Substitution cost, default 1 for distance, 2 for all ratios
         * @return Integer the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);

        if (!choices || choices.length === 0) console.log("No choices");
        if (options.processor && typeof options.processor !== "function") console.log("Invalid Processor");
        if (!options.processor) options.processor = function(x) {return x;}
        if (!options.scorer || typeof options.scorer !== "function") {
            options.scorer = QRatio;
            console.log("Using default scorer");
        }
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1;}
        var pre_processor = function(choice, force_ascii) {return choice;}
        if (options.full_process) pre_processor = full_process;
        options.full_process = false;
        query = pre_processor(query, options.force_ascii);
        if (query.length === 0) console.log("Processed query is empty string");
        var results = [];
        var anyblank = false;
        var tsort = false;
        var tset = false;
        if (options.scorer.name === "token_sort_ratio" || options.scorer.name === "partial_token_sort_ratio") {
            var proc_sorted_query = _process_and_sort(query);
            tsort = true;
        }
        else if (options.scorer.name === "token_set_ratio" || options.scorer.name === "partial_token_set_ratio") {
            var query_tokens = tokenize(query);
            tset = true;
        }
        for (var c = 0; c < choices.length; c++) {
            options.tokens = undefined;
            options.proc_sorted = false;
            if (tsort) {
                options.proc_sorted = true;
                if (choices[c].proc_sorted) var mychoice = choices[c].proc_sorted;
                else {
                    var mychoice = pre_processor(options.processor(choices[c]), options.force_ascii).valueOf();
                    mychoice = _process_and_sort(mychoice);
                }
                var result = options.scorer(proc_sorted_query, mychoice, options);
            }
            else if (tset) {
                var mychoice = pre_processor(options.processor(choices[c]), options.force_ascii).valueOf();
                if (choices[c].tokens) options.tokens = [query_tokens, choices[c].tokens];
                else options.tokens = [query_tokens, tokenize(mychoice)]
                //query and mychoice only used for validation here
                var result = options.scorer(query, mychoice, options);
            }
            else {
                var mychoice = pre_processor(options.processor(choices[c]), options.force_ascii).valueOf();
                if (typeof mychoice !== "string" || (typeof mychoice === "string" && mychoice.length === 0)) anyblank = true;
                var result = options.scorer(query, mychoice, options);
            }
            if (result > options.cutoff) results.push([choices[c],result]);
        } 
        if(anyblank) console.log("One or more choices were empty. (post-processing if applied)")
        if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < choices.length) {
            var cmp = function(a, b) { return a[1] - b[1]; }
            results = Heap.nlargest(results, options.limit, cmp);
        }
        else {
            results = results.sort(function(a,b){return b[1]-a[1];});
        }
        return results;
    }

/** Main Scoring Code */

    function _lev_distance(str1, str2, options) {
        if (!options.ratio_alg) return _leven(str1, str2, options);
        else if (options.ratio_alg === "fast_levenshtein") return fast_levenshtein(str1, str2, options); //keeping till leven edits fully tested
        else if (options.ratio_alg === "sift3") return sift3Distance(str1, str2, options)
        else if (options.ratio_alg === "sift4") return sift4Distance(str1, str2, options)
        else if (options.ratio_alg === "damlev") return damlev.default(str1, str2)
        else return _leven(str1, str2, options);
    }

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
        if (options.partial) ratio_func = _partial_ratio;

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
        if (options.ratio_alg && options.ratio_alg === "difflib") { //checking for other variants in _lev_distance too
            var m = new difflib.SequenceMatcher(null, str1, str2);
            var r = m.ratio();
            return Math.round(100 * r);
        }
        //to match behavior of python-Levenshtein/fuzzywuzzy, substitution cost is 2 if not specified, or would default to 1
        if (typeof options.subcost === "undefined") options.subcost = 2;
        var levdistance = _lev_distance(str1, str2, options);
        var lensum = str1.length + str2.length ; //TODO: account for unicode double byte astral stuff
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

    function _process_and_sort(str) {
        return str.match(/\S+/g).sort().join(" ").trim();
    }

     function tokenize(str) {
        return str.match(/\S+/g);
    }

    /** from https://github.com/hiddentao/fast-levenshtein slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */

    // arrays to re-use
    var prevRow = [], str2Char = [];

    var collator;
    try {
        collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
    } catch (err) {
        console.log("Collator could not be initialized and wouldn't be used");
    }
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

    // testing if faster than fast-levenshtein..
    /** from https://github.com/sindresorhus/leven slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */
    var arr = [];
    var charCodeCache = [];

    var _leven = function (a, b, options) {
        var useCollator = (options && collator && options.useCollator);
        var subcost = 1;
        //to match behavior of python-Levenshtein and fuzzywuzzy
        if (options.subcost && typeof options.subcost === "number") subcost = options.subcost;

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

        while (j < bLen) {
            bCharCode = b.charCodeAt(j);
            tmp = j++;
            ret = j;

            for (i = 0; i < aLen; i++) {
                tmp2 = useCollator ? (0 === collator.compare(String.fromCharCode(bCharCode), String.fromCharCode(charCodeCache[i])) ? tmp : tmp + subcost) : bCharCode === charCodeCache[i] ? tmp : tmp + subcost;
                //tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + subcost;
                tmp = arr[i];
                ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
            }
        }

        return ret;
    };

    /** from https://github.com/mailcheck/mailcheck */
    function sift3Distance(s1, s2, options) {
        if (s1 == null || s1.length === 0) {
            if (s2 == null || s2.length === 0) {
                return 0;
            } else {
                return s2.length;
            }
        }

        if (s2 == null || s2.length === 0) {
            return s1.length;
        }

        var c = 0;
        var offset1 = 0;
        var offset2 = 0;
        var lcs = 0;
        var maxOffset;
        if (options.maxOffset && typeof options.maxOffset === "number") {
            maxOffset = options.maxOffset;
        }
        else {
            maxOffset = 5; //default
        }

        while ((c + offset1 < s1.length) && (c + offset2 < s2.length)) {
            if (s1.charAt(c + offset1) == s2.charAt(c + offset2)) {
                lcs++;
            } else {
                offset1 = 0;
                offset2 = 0;
                for (var i = 0; i < maxOffset; i++) {
                    if ((c + i < s1.length) && (s1.charAt(c + i) == s2.charAt(c))) {
                        offset1 = i;
                        break;
                    }
                    if ((c + i < s2.length) && (s1.charAt(c) == s2.charAt(c + i))) {
                        offset2 = i;
                        break;
                    }
                }
            }
            c++;
        }
        return (s1.length + s2.length) / 2 - lcs;
    }

    /** from https://github.com/mailcheck/mailcheck */
    function sift4Distance(s1, s2, options) {
        // sift4: https://siderite.blogspot.com/2014/11/super-fast-and-accurate-string-distance.html
        var maxOffset;
        if (options.maxOffset && typeof options.maxOffset === "number") {
            maxOffset = options.maxOffset;
        }
        else {
            maxOffset = 5; //default
        }

        if (!s1 || !s1.length) {
            if (!s2) {
                return 0;
            }
            return s2.length;
        }

        if (!s2 || !s2.length) {
            return s1.length;
        }

        var l1 = s1.length;
        var l2 = s2.length;

        var c1 = 0;  //cursor for string 1
        var c2 = 0;  //cursor for string 2
        var lcss = 0;  //largest common subsequence
        var local_cs = 0; //local common substring
        var trans = 0;  //number of transpositions ('ab' vs 'ba')
        var offset_arr = [];  //offset pair array, for computing the transpositions

        while ((c1 < l1) && (c2 < l2)) {
            if (s1.charAt(c1) == s2.charAt(c2)) {
                local_cs++;
                var isTrans = false;
                //see if current match is a transposition
                var i = 0;
                while (i < offset_arr.length) {
                    var ofs = offset_arr[i];
                    if (c1 <= ofs.c1 || c2 <= ofs.c2) {
                        // when two matches cross, the one considered a transposition is the one with the largest difference in offsets
                        isTrans = Math.abs(c2 - c1) >= Math.abs(ofs.c2 - ofs.c1);
                        if (isTrans) {
                            trans++;
                        } else {
                            if (!ofs.trans) {
                                ofs.trans = true;
                                trans++;
                            }
                        }
                        break;
                    } else {
                        if (c1 > ofs.c2 && c2 > ofs.c1) {
                            offset_arr.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                }
                offset_arr.push({
                    c1: c1,
                    c2: c2,
                    trans: isTrans
                });
            } else {
                lcss += local_cs;
                local_cs = 0;
                if (c1 != c2) {
                    c1 = c2 = Math.min(c1, c2);  //using min allows the computation of transpositions
                }
                //if matching characters are found, remove 1 from both cursors (they get incremented at the end of the loop)
                //so that we can have only one code block handling matches 
                for (var j = 0; j < maxOffset && (c1 + j < l1 || c2 + j < l2); j++) {
                    if ((c1 + j < l1) && (s1.charAt(c1 + j) == s2.charAt(c2))) {
                        c1 += j - 1;
                        c2--;
                        break;
                    }
                    if ((c2 + j < l2) && (s1.charAt(c1) == s2.charAt(c2 + j))) {
                        c1--;
                        c2 += j - 1;
                        break;
                    }
                }
            }
            c1++;
            c2++;
            // this covers the case where the last match is on the last token in list, so that it can compute transpositions correctly
            if ((c1 >= l1) || (c2 >= l2)) {
                lcss += local_cs;
                local_cs = 0;
                c1 = c2 = Math.min(c1, c2);
            }
        }
        lcss += local_cs;
        return Math.round(Math.max(l1, l2) - lcss + trans); //add the cost of transpositions to the final result
    }


/**    Utils   */

    function _validate(str) {
        if (typeof str === "string" && str.length > 0) return true;
        else return false;
    }

    function full_process(str, force_ascii) {
        if (typeof str !== "string") return "";
        // Non-ascii won't turn into whitespace if force_ascii
        if (force_ascii !== false) str = str.replace(/[^\x00-\x7F]/g, "");
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
        damlev: damlev.default,
        ratio: QRatio,
        partial_ratio: partial_ratio,
        token_set_ratio: token_set_ratio,
        token_sort_ratio: token_sort_ratio,
        partial_token_set_ratio: partial_token_set_ratio,
        partial_token_sort_ratio: partial_token_sort_ratio,
        WRatio: WRatio,
        full_process: full_process,
        extract: extract,
        process_and_sort: _process_and_sort,
        tokenize: tokenize
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
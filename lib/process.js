module.exports = function (_clone_and_set_option_defaults, _isArray, QRatio, extract) {

    module = {};

    module.dedupe = function dedupe(contains_dupes, options_p) {

        /**
        * This convenience function takes a list of strings containing duplicates and uses fuzzy matching to identify
        * and remove duplicates. Specifically, it uses extract to identify duplicates that
        * score greater than a user defined threshold/cutoff. Then, it looks for the longest item in the duplicate list
        * since we assume this item contains the most entity information and returns that. It breaks string
        * length ties on an alphabetical sort.
        * 
        * Note: as the threshold DECREASES the number of duplicates that are found INCREASES. This means that the
        * returned deduplicated list will likely be shorter. Raise the threshold for fuzzy_dedupe to be less
        * sensitive.
        *
        * @function dedupe
        * @param {String[]|Object[]|Object} contains_dupes - array of strings, or array of choice objects if processor is supplied, or object of form {key: choice}
        * @param {Object} [options_p] - Additional options.
        * @param {boolean} [options_p.useCollator] - Whether to include map of matching items in results
        * @param {function} [options_p.scorer] - takes two strings and returns a score
        * @param {function} [options_p.processor] - takes each choice and outputs a string to be used for Scoring
        * @param {number} [options_p.cutoff] - matching threshold 0-100, Default: 70
        * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
        * @param {boolean} [options_p.astral] - use iLeven for scoring to properly handle astral symbols
        * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
        * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false
        * @param {boolean} [options_p.trySimple] - try simple/partial ratio as part of (parial_)token_set_ratio test suite
        * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
        * @param {string} [options_p.wildcards] - characters that will be used as wildcards if provided
        * @param {boolean} [options_p.collapseWhitespace] - Collapse consecutive white space during full_process, default true
        * @param {string} [options_p.normalize] - Normalize unicode representations
        * @param {boolean} [options_p.keepmap] - keep the items mapped to this value, default false
        * @param {boolean} [options_p.returnObjects] - return array of object instead of array of tuples
        * @returns {Object[] | Array[]} - array of unique items and the index/key of the used match in contains_dupes.
        */

        var options = _clone_and_set_option_defaults(options_p);

        if (!(_isArray(contains_dupes) || typeof contains_dupes === 'object')) {
            throw new Error("contains_dupes must be an array or object");
            return
        }
        if (Object.keys(contains_dupes).length === 0) {
            if (typeof console !== undefined) console.warn("contains_dupes is empty");
            return [];
        }
        if (options.limit) {
            if (typeof console !== undefined) console.warn("options.limit will be ignored in dedupe");
            options.limit = 0;
        }

        if (!options.cutoff || typeof options.cutoff !== 'number') {
            if (typeof console !== undefined) console.warn("Using default cutoff of 70");
            options.cutoff = 70;
        }

        if (!options.scorer) {
            options.scorer = QRatio;
            if (typeof console !== undefined) console.log("Using default scorer 'ratio' for dedupe");
        }

        // extract will only run processor on choice so do here
        var processor;
        if (options.processor && typeof options.processor === "function") {
            processor = options.processor;
        }
        else processor = function (x) { return x; }

        var uniqueItems = {};

        for (var i in contains_dupes) {
            var item = processor(contains_dupes[i]);

            if (typeof item !== 'string' && item instanceof String === false) {
                throw new Error("Each processed item in dedupe must be a string.");
            }

            var matches = extract(item, contains_dupes, options);

            if (options.returnObjects) {
                if (matches.length === 1) {
                    if (options.keepmap) uniqueItems[processor(matches[0].choice)] = { item: matches[0].choice, key: matches[0].key, matches: matches};
                    else uniqueItems[processor(matches[0].choice)] = {item: matches[0].choice, key: matches[0].key};
                }
                else {
                    // take longest, break tie by string compare
                    matches = matches.sort(function (a, b) {
                        var pa = processor(a.choice);
                        var pb = processor(b.choice);
                        var aLen = pa.length;
                        var bLen = pb.length;
                        if (aLen === bLen) {
                            if (pa < pb) return -1;
                            else return 1;
                        }
                        else return bLen - aLen;
                    });
                    if (options.keepmap) uniqueItems[processor(matches[0].choice)] = { item: matches[0].choice, key: matches[0].key, matches: matches };
                    else uniqueItems[processor(matches[0].choice)] = {item: matches[0].choice, key: matches[0].key};
                }
            }
            else {
                if (matches.length === 1) {
                    if (options.keepmap) uniqueItems[processor(matches[0][0])] = [matches[0][0], matches[0][2], matches];
                    else uniqueItems[processor(matches[0][0])] = [matches[0][0], matches[0][2]];
                }
                else {
                    // take longest, break tie by string compare
                    matches = matches.sort(function (a, b) {
                        var pa = processor(a[0]);
                        var pb = processor(b[0]);
                        var aLen = pa.length;
                        var bLen = pb.length;
                        if (aLen === bLen) {
                            if (pa < pb) return -1;
                            else return 1;
                        }
                        else return bLen - aLen;
                    });
                    if (options.keepmap) uniqueItems[processor(matches[0][0])] = [matches[0][0], matches[0][2], matches];
                    else uniqueItems[processor(matches[0][0])] = [matches[0][0], matches[0][2]];
                }
            }            
        }

        var uniqueVals = [];

        for (var u in uniqueItems) {
            uniqueVals.push(uniqueItems[u]);
        }

        return uniqueVals;
    }

    return module
}
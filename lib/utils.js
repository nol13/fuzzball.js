module.exports = function (_uniq, _uniqWith, _partialRight) {
    var module = {};

    var xre = require('./xregexp/index.js');
    var wildLeven = require('./wildcardLeven.js');
    var leven = require('./leven.js');

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // from MDN
    }

     function validate(str) {
        if ((typeof str === "string" || str instanceof String) && str.length > 0) return true;
        else return false;
    }

    module.validate = validate;

    module.process_and_sort = function process_and_sort(str) {
        if (!validate(str)) return "";
        return str.match(/\S+/g).sort().join(" ").trim();
    }

    module.tokenize = function unique_tokens(str, options) {
        if (options && options.wildcards  && _uniqWith && _partialRight) {
            var partWild = _partialRight(wildLeven, options, leven);
            var wildCompare = function (a, b) { return partWild(a, b) === 0; }
            return _uniqWith(str.match(/\S+/g), wildCompare);
        } 
        else return _uniq(str.match(/\S+/g));
    }

    var alphaNumUnicode = xre('[^\\pN|\\pL]', 'g');
    module.full_process = function full_process(str, options) {
        if (!(str instanceof String) && typeof str !== "string") return "";
        var processedtext;

        if (options && typeof options === "object" && options.wildcards && typeof options.wildcards === "string" && options.wildcards.length > 0) {
            var wildcards = options.wildcards.toLowerCase();
            str = str.toLowerCase();
            if (options.force_ascii) {
                // replace non-ascii non-wildcards
                var pattern = '[^\x00 -\x7F|' + escapeRegExp(wildcards) + ']';
                str = str.replace(new RegExp(pattern, "g"), "");
                
                // replace wildcards with wildchar
                var wildpattern = '[' + escapeRegExp(wildcards) + ']';
                var wildchar = wildcards[0];
                str = str.replace(new RegExp(wildpattern, "g"), wildchar);

                // replace non alpha-num non-wildcards with space
                var alphanumPat = '[^A-Za-z0-9' + escapeRegExp(wildcards) + ']';
                str = str.replace(new RegExp(alphanumPat, "g"), " ");
                str = str.replace(/_/g, ' ');

                // wildcards are case insensitive as of now
                // would need to make sure lower version of wildcards didnt get turned into wildcards
                processedtext = str.trim();
            }
            else {
                // replace non-alphanum non-wildcards
                var upattern = '[^\\pN|\\pL|' + escapeRegExp(wildcards) + ']';
                var alphaNumUnicodeWild = xre(upattern, 'g');
                str = xre.replace(str, alphaNumUnicodeWild, ' ', 'all');

                // replace wildcards with wildchar
                var wildpattern = '[' + escapeRegExp(wildcards) + ']';
                var wildchar = wildcards[0];
                str = str.replace(new RegExp(wildpattern, "g"), wildchar);

                // wildcards are case insensitive as of now
                // would need to make sure lower version of wildcards didnt get turned into wildcards
                processedtext = str.trim();
            }
        }
        else {
            // Non-ascii won't turn into whitespace if not force_ascii
            if (options && (options.force_ascii || options === true)) { //support old behavior just passing true
                str = str.replace(/[^\x00-\x7F]/g, "");
                processedtext = str.replace(/\W|_/g, ' ').toLowerCase().trim();
            }
            processedtext = xre.replace(str, alphaNumUnicode, ' ', 'all').toLowerCase().trim();
        }
        if (options && options.collapseWhitespace) {
            processedtext = processedtext.replace(/\s+/g, ' ');
        }
        return processedtext;
    }

    // clone/shallow copy whatev
    module.clone_and_set_option_defaults = function(options) {
        // don't run more than once if usign extract functions
        if (options && options.isAClone) return options;
        var optclone = { isAClone: true };
        if (options) {
            var i, keys = Object.keys(options);
            for (i = 0; i < keys.length; i++) {
                optclone[keys[i]] = options[keys[i]];
            }
        }
        if (!(typeof optclone.full_process !== 'undefined' && optclone.full_process === false)) optclone.full_process = true;
        if (!(typeof optclone.force_ascii !== 'undefined' && optclone.force_ascii === true)) optclone.force_ascii = false;
        // normalize option not used unless astral is true, so true + no astral = no normalize
        if (!(typeof optclone.normalize !== 'undefined' && optclone.normalize === false)) optclone.normalize = true;
        if (typeof optclone.astral !== 'undefined' && optclone.astral === true) optclone.full_process = false;
        if (!(typeof optclone.collapseWhitespace !== 'undefined' && optclone.collapseWhitespace === false)) optclone.collapseWhitespace = true;
        return optclone;
    }

    module.isCustomFunc = function(func) {
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

    return module;
}
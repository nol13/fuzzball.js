module.exports = function (_uniq) {
    var module = {};

    var xre = require('./xregexp/index.js');

    module.validate = function(str) {
        if ((typeof str === "string" || str instanceof String) && str.length > 0) return true;
        else return false;
    }

    module.process_and_sort = function(str) {
        return str.match(/\S+/g).sort().join(" ").trim();
    }

    module.tokenize = function(str) {
        return _uniq(str.match(/\S+/g));
    }

    var alphaNumUnicode = xre('[^\\pN|\\pL|_]', 'g');
    module.full_process = function(str, force_ascii) {
        if (!(str instanceof String) && typeof str !== "string") return "";
        // Non-ascii won't turn into whitespace if not force_ascii
        if (force_ascii === true) {
            str = str.replace(/[^\x00-\x7F]/g, "");
            return str.replace(/\W|_/g, ' ').toLowerCase().trim();
        }
        return xre.replace(str, alphaNumUnicode, ' ', 'all').toLowerCase().trim();
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
        //  if (typeof optclone.useCollator !== 'undefined' && optclone.useCollator === true) optclone.full_process = false;
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
module.exports = function (_uniq) {
    var module = {};

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
        return _uniq(str.match(/\S+/g));
    }

    module.full_process = function full_process(str, options) {
        if (!(str instanceof String) && typeof str !== "string") return "";
        var processedtext;

            // Non-ascii won't turn into whitespace if not force_ascii
            if (options && (options.force_ascii || options === true)) { //support old behavior just passing true
                str = str.replace(/[^\x00-\x7F]/g, "");
            }
        processedtext = str.replace(/\W|_/g, ' ').toLowerCase().trim();
        if (options && options.collapseWhitespace) {
            processedtext = processedtext.replace(/\s+/g, ' ');
        }
        return processedtext;
    }

    // clone/shallow copy whatev
    module.clone_and_set_option_defaults = function (options) {
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
        if (!(typeof optclone.collapseWhitespace !== 'undefined' && optclone.collapseWhitespace === false)) optclone.collapseWhitespace = true;
        return optclone;
    }

    module.isCustomFunc = function (func) {
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
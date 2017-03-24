var assert = require('assert');
var fuzz = require('../fuzzball');
var fuzzlite = require('../lite/fuzzball_lite');
var data = require('./testdata');
var scorers = [fuzz.ratio, fuzz.token_set_ratio, fuzz.token_sort_ratio, fuzz.partial_token_set_ratio, fuzz.partial_token_sort_ratio, fuzz.WRatio]

describe('full_process', function () {
    it('should return true if full_process running', function () {
        assert.equal(fuzz.ratio("this is a test", "this is a test!"), 100);
    });
    it('should return true if full_process not running', function () {
        var options = {full_process: false}; //non-alphanumeric will not be converted to whitespace if false, default true 
        assert.equal(fuzz.ratio("this is a test", "this is a test!", options), 97);
    });
});

describe('Scorer Identity Tests', function () {
    for (var scorer in scorers) {
        var tmpscorer = scorers[scorer];
        describe('Scorer: ' + tmpscorer.name, function () {

            it('should return 0 if either string is empty', function () {
                assert.equal(0, tmpscorer("", "striiing"));
                assert.equal(0, tmpscorer("striing", ""));
            });

            it('should return true if order of strings doesn\'t matter', function () {
                assert.equal(tmpscorer("ml215 MLFP14E P3xx635-215", "MLFP14EP 3xx635-215"), tmpscorer("MLFP14EP 3xx635-215", "ml215 MLFP14E P3xx635-215"));
            });

            it('should return 100 if exact match', function () {
                for (var s in data.strings) {
                    assert.equal(100, tmpscorer(data.strings[s], data.strings[s]));
                }
                for (var s in data.mixed_strings) {
                    assert.equal(100, tmpscorer(data.mixed_strings[s], data.mixed_strings[s], { full_process: false, useCollator: false, ratio_alg: "leven" }));
                }
                for (var s in data.a) {
                    assert.equal(100, tmpscorer(data.a[s][0], data.a[s][0], { full_process: false }));
                }
            });
        });
    }
});

describe('Python Test Scores Comparison', function () {
    for (var tscorer in scorers) {
        var tmp = tscorer; //needs to be closure i guess?
        describe('Test Scores with: ' + scorers[tmp].name, function () {
            it('should match test scores', function () {
                var tc = 0
                for (var i = 0; i < data.strings.length; i++) {
                    for (var j = 0; j < data.strings.length; j++) {
                        result = scorers[tmp](data.strings[i], data.strings[j])
                        assert.equal(result, data.string_scores[((tmp * (data.strings.length * data.strings.length)) + tc)]);
                        tc++;
                    }
                }
            });
        });
    }
});

describe('Extract', function () {
    it('should return true if extract with default options working', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzz.extract(query, choices);
        assert.equal(results[0][1], 100);
        assert.equal(results[1][1], 80);
        assert.equal(results[2][1], 60);
        assert.equal(results[1][0], 'koala bear');
    });
    it('should return true if extract with README options working', function () {
        var query = "126abzx";
        var choices = [{ id: 345, modelnumber: "123abc" }, { id: 346, modelnumber: "123efg" }, { id: 347, modelnumber: "456abdzx" }];
        var options = {
            scorer: fuzz.partial_ratio,
            processor: function (choice) { return choice['modelnumber'] },
            limit: 2,
            cutoff: 50
        };
        var results = fuzz.extract(query, choices, options);
        assert.equal(results[0][1], 71);
        assert.equal(results[1][1], 67);
        assert.equal(results.length, 2);
        assert.equal(results[0][0].modelnumber, '456abdzx');
    });
});

describe('Extract with pre-calculated tokens', function () {
    it('should return true if pre-calculating tokens and using dummy string doesnt effect token_set_ratio', function () {
        var query = "126 abz x";
        var choices = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];
        var choices2 = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];

        for (var c in choices2) {
            choices2[c].tokens = fuzz.unique_tokens(fuzz.full_process(choices2[c].modelnumber));
            choices2[c].modelnumber = "0";
        }
        var options = {
            scorer: fuzz.token_set_ratio,
            processor: function (choice) { return choice['modelnumber'] },
            limit: 2,
            cutoff: 50
        };
        var results = fuzz.extract(query, choices, options);
        var results2 = fuzz.extract(query, choices2, options);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);
    });
    it('should return true if pre-calculating tokens and not using processor function doesnt affect token_set_ratio results', function () {
        var query = "126 abz x";
        var choices = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];
        var choices2 = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];

        for (var c in choices2) {
            choices2[c].tokens = fuzz.unique_tokens(fuzz.full_process(choices2[c].modelnumber));
            choices2[c].modelnumber = "0";
        }
        var options = {
            scorer: fuzz.token_set_ratio,
            processor: function (choice) { return choice['modelnumber'] },
            limit: 2,
            cutoff: 50
        };
        var options2 = {
            scorer: fuzz.token_set_ratio,
            limit: 2,
            cutoff: 50
        };
        var results = fuzz.extract(query, choices, options);
        var results2 = fuzz.extract(query, choices2, options2);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);
    });
        it('should return true if pre-calculating tokens and using dummy string doesnt effect token_sort_ratio', function () {
        var query = "126 abz x";
        var choices = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];
        var choices2 = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];

        for (var c in choices2) {
            choices2[c].proc_sorted = fuzz.process_and_sort(fuzz.full_process(choices2[c].modelnumber));
            choices2[c].modelnumber = "0";
        }
        var options = {
            scorer: fuzz.token_sort_ratio,
            processor: function (choice) { return choice['modelnumber'] },
            limit: 2,
            cutoff: 50
        };
        var results = fuzz.extract(query, choices, options);
        var results2 = fuzz.extract(query, choices2, options);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);
    });
    it('should return true if pre-calculating tokens and not using processor function doesnt affect token_sort_ratio results', function () {
        var query = "126 abz x";
        var choices = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];
        var choices2 = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];

        for (var c in choices2) {
            choices2[c].proc_sorted = fuzz.process_and_sort(fuzz.full_process(choices2[c].modelnumber));
            choices2[c].modelnumber = "0";
        }
        var options = {
            scorer: fuzz.token_sort_ratio,
            processor: function (choice) { return choice['modelnumber'] },
            limit: 2,
            cutoff: 50
        };
        var options2 = {
            scorer: fuzz.token_sort_ratio,
            limit: 2,
            cutoff: 50
        };
        var results = fuzz.extract(query, choices, options);
        var results2 = fuzz.extract(query, choices2, options2);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);
    });
});

describe('fullball_lite', function () {
    it('should return true if fullball_lite scorers give same results', function () {
        assert.equal(fuzz.ratio("this is a test", "this is a test!"), fuzzlite.ratio("this is a test", "this is a test!"));
        assert.equal(fuzz.ratio("this isnt a test", "this is a test!"), fuzzlite.ratio("this isnt a test", "this is a test!"));
        assert.equal(fuzz.token_set_ratio("this isnt a test", "this is a test!"), fuzzlite.token_set_ratio("this isnt a test", "this is a test!"));
        assert.equal(fuzz.token_sort_ratio("this isnt a test", "this is a test!"), fuzzlite.token_sort_ratio("this isnt a test", "this is a test!"));
    });
    it('should return true if in lite extract pre-calculating tokens and using dummy string gives same results', function () {
        var query = "126 abz x";
        var choices2 = [{ id: 345, modelnumber: "123 abc" }, { id: 346, modelnumber: "123 efg" }, { id: 347, modelnumber: "456 ab dzx" }];

        for (var c in choices2) {
            choices2[c].tokens = fuzz.unique_tokens(fuzz.full_process(choices2[c].modelnumber));
            choices2[c].modelnumber = "0";
        }
        var options = {
            scorer: fuzz.token_set_ratio,
            processor: function (choice) { return choice['modelnumber'] },
            limit: 2,
            cutoff: 50
        };
        var results = fuzz.extract(query, choices2, options);
        var results2 = fuzzlite.extract(query, choices2, options);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);
    });
});

describe('astral', function () {
    it('should return true if astral treated properly', function () {
        var options = {astral:true, full_process:false};
        assert.equal(fuzz.ratio("aa🐴", "aab", options), fuzz.ratio("aad", "aab", options));
        assert.equal(fuzz.ratio("aa🐴a", "aaba", options), fuzz.ratio("aada", "aaba", options));
    });
    it('should return true if astral treated properly lite', function () {
        var options = { astral: true, full_process: false };
        assert.equal(fuzzlite.ratio("aa🐴", "aab", options), fuzzlite.ratio("aad", "aab", options));
        assert.equal(fuzzlite.ratio("aa🐴a", "aaba", options), fuzzlite.ratio("aada", "aaba", options));
    });
});

describe('async', function () {
    it('should return true if extractAsync with default options working', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzz.extractAsync(query, choices, {}, function(results){
            assert.equal(results[0][1], 100);
            assert.equal(results[1][1], 80);
            assert.equal(results[2][1], 60);
            assert.equal(results[1][0], 'koala bear');
            done();
        });
    });
    it('should return true if extractAsync lite with default options working', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzlite.extractAsync(query, choices, {}, function (results) {
            assert.equal(results[0][1], 100);
            assert.equal(results[1][1], 80);
            assert.equal(results[2][1], 60);
            assert.equal(results[1][0], 'koala bear');
            done();
        });
    });
});
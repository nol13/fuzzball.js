var assert = require('assert');
var fuzz = require('../fuzzball.js');
var fuzzlite = require('../lite/fuzzball_lite.js');
var fuzzultra = require('../ultra_lite/fuzzball_ultra_lite.js');
if (process.env.testenv === "build") {
    console.log('TESTING BUILD');
    fuzz = require('../dist/fuzzball.umd.min.js');
    fuzzlite = require('../lite/fuzzball_lite.umd.min.js');
    fuzzultra = require('../ultra_lite/fuzzball_ultra_lite.umd.min.js');
}
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
                    assert.equal(100, tmpscorer(data.mixed_strings[s], data.mixed_strings[s], { full_process: false}));
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
                        var result = scorers[tmp](data.strings[i], data.strings[j])
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
    it('should return true if extract with default options working lite', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzzlite.extract(query, choices);
        assert.equal(results[0][1], 100);
        assert.equal(results[1][1], 80);
        assert.equal(results[2][1], 60);
        assert.equal(results[1][0], 'koala bear');
    });
    it('should return true if extract with default options working ultra_lite', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzzultra.extract(query, choices);
        console.log(results);
        assert.equal(results[0][1], 100);
        assert.equal(results[1][1], 80);
        assert.equal(results[2][1], 60);
        assert.equal(results[1][0], 'koala bear');
    });

    it('should return true if extract with with options.returnObjects = true is working', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzz.extract(query, choices, { returnObjects: true });
        console.log(results);
        assert.equal(results[0].score, 100);
        assert.equal(results[1].score, 80);
        assert.equal(results[2].score, 60);
        assert.equal(results[1].choice, 'koala bear');
    });
    it('should return true if extract with with options.returnObjects = true is working lite', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzzlite.extract(query, choices, { returnObjects: true });
        assert.equal(results[0].score, 100);
        assert.equal(results[1].score, 80);
        assert.equal(results[2].score, 60);
        assert.equal(results[1].choice, 'koala bear');
    });
    it('should return true if extract with with options.returnObjects = true is working ultra_lite', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzzultra.extract(query, choices, { returnObjects: true });
        console.log(results);
        assert.equal(results[0].score, 100);
        assert.equal(results[1].score, 80);
        assert.equal(results[2].score, 60);
        assert.equal(results[1].choice, 'koala bear');
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
    it('should return true if extract with null query not error', function () {
        var query = null;
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzz.extract(query, choices, {scorer: fuzz.token_sort_ratio});
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with token_sort and null query not error lite', function () {
        var query = null;
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzzlite.extract(query, choices, { scorer: fuzzlite.token_sort_ratio });
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with token_sort and null query not error ultra_lite', function () {
        var query = null;
        var choices = ["brown bear", "polar bear", "koala bear"];
        var results = fuzzultra.extract(query, choices, { scorer: fuzzlite.token_sort_ratio });
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with token_sort null choices not error', function () {
        var query = null;
        var choices = [null, undefined, null];
        var results = fuzz.extract(query, choices, { scorer: fuzz.token_sort_ratio });
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with token_sort null choices not error lite', function () {
        var query = null;
        var choices = [null, undefined, null];
        var results = fuzz.extract(query, choices, { scorer: fuzz.token_sort_ratio });
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with token_set null choices not error', function () {
        var query = null;
        var choices = [null, undefined, null];
        var results = fuzz.extract(query, choices, { scorer: fuzz.token_set_ratio });
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with token_set null choices not error lite', function () {
        var query = null;
        var choices = [null, undefined, null];
        var results = fuzz.extract(query, choices, { scorer: fuzz.token_set_ratio });
        assert.equal(results[0][1], 0);
    });
    it('should return true if extract with partial null choices not error', function () {
        var query = null;
        var choices = [null, undefined, null];
        var results = fuzz.extract(query, choices, { scorer: fuzz.partial_ratio });
        assert.equal(results[0][1], 0);
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

        results = fuzzlite.extract(query, choices, options);
        results2 = fuzzlite.extract(query, choices2, options);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);

        results = fuzzultra.extract(query, choices, options);
        results2 = fuzzultra.extract(query, choices2, options);
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

        results = fuzzlite.extract(query, choices, options);
        results2 = fuzzlite.extract(query, choices2, options2);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);

        results = fuzzultra.extract(query, choices, options);
        results2 = fuzzultra.extract(query, choices2, options2);
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

        results = fuzzlite.extract(query, choices, options);
        results2 = fuzzlite.extract(query, choices2, options);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);

        results = fuzzultra.extract(query, choices, options);
        results2 = fuzzultra.extract(query, choices2, options);
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

        results = fuzzlite.extract(query, choices, options);
        results2 = fuzzlite.extract(query, choices2, options2);
        assert.equal(results[0][1], results2[0][1]);
        assert.equal(results[1][1], results2[1][1]);
        assert.equal(results[0][2], results2[0][2]);
        assert.equal(results[1][2], results2[1][2]);

        results = fuzzultra.extract(query, choices, options);
        results2 = fuzzultra.extract(query, choices2, options2);
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
    it('should return true if fullball_ultra_lite scorers give same results', function () {
        assert.equal(fuzz.ratio("this is a test", "this is a test!"), fuzzultra.ratio("this is a test", "this is a test!"));
        assert.equal(fuzz.ratio("this isnt a test", "this is a test!"), fuzzultra.ratio("this isnt a test", "this is a test!"));
        assert.equal(fuzz.token_set_ratio("this isnt a test", "this is a test!"), fuzzultra.token_set_ratio("this isnt a test", "this is a test!"));
        assert.equal(fuzz.token_sort_ratio("this isnt a test", "this is a test!"), fuzzultra.token_sort_ratio("this isnt a test", "this is a test!"));
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

describe('normalize', function () {
    if (String.prototype.normalize) {
        it('should return true if normalized properly', function () {
            var options = { astral: true };
            assert.equal(fuzz.ratio("mañana", "mañana", options), 100);
            assert.equal(fuzz.ratio("polar bear mañana", "polar bear mañana", options), 100);
        });
        it('should return true if normalized properly lite', function () {
            var options = { astral: true };
            assert.equal(fuzzlite.ratio("mañana", "mañana", options), 100);
            assert.equal(fuzzlite.ratio("polar bear mañana", "polar bear mañana", options), 100);
        });
        it('should return true if extractAsync with normalize working', function (done) {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            fuzz.extractAsync(query, choices, { astral: true }, function (err, results) {
                assert.equal(results[0][1], 100);
                done();
            });
        });
        it('should return true if extractAsync with normalize working lite', function (done) {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            fuzzlite.extractAsync(query, choices, { astral: true }, function (err, results) {
                assert.equal(results[0][1], 100);
                done();
            });
        });
        it('should return true if extract with normalize working', function () {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            var results = fuzz.extract(query, choices, { astral: true });
            assert.equal(results[0][1], 100);
        });
        it('should return true if extract with normalize working lite', function () {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            var results = fuzzlite.extract(query, choices, { astral: true });
            assert.equal(results[0][1], 100);
        });
        it('should return true if extract with normalize working with token_set_ratio', function () {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            var results = fuzz.extract(query, choices, { astral: true, scorer: fuzz.token_set_ratio });
            assert.equal(results[0][1], 100);
        });
        it('should return true if extract with normalize working with token_set_ratio lite', function () {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            var results = fuzzlite.extract(query, choices, { astral: true, scorer: fuzzlite.token_set_ratio });
            assert.equal(results[0][1], 100);
        });
        it('should return true if extract with normalize working with token_sort_ratio', function () {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            var results = fuzz.extract(query, choices, { astral: true, scorer: fuzz.token_sort_ratio });
            assert.equal(results[0][1], 100);
        });
        it('should return true if extract with normalize working with token_sort_ratio lite', function () {
            var query = "polar bear mañana";
            var choices = ["brown bear", "polar bear mañana", "koala bear"];
            var results = fuzzlite.extract(query, choices, { astral: true, scorer: fuzzlite.token_sort_ratio });
            assert.equal(results[0][1], 100);
        });
    }
});

describe('async', function () {
    it('should return true if extractAsync with default options working', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzz.extractAsync(query, choices, {}, function(err, results){
            assert.equal(results[0][1], 100);
            assert.equal(results[1][1], 80);
            assert.equal(results[2][1], 60);
            assert.equal(results[1][0], 'koala bear');
            done();
        });
    });
    it('should return true if extractAsync lite with default options working lite', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzlite.extractAsync(query, choices, {}, function (err, results) {
            assert.equal(results[0][1], 100);
            assert.equal(results[1][1], 80);
            assert.equal(results[2][1], 60);
            assert.equal(results[1][0], 'koala bear');
            done();
        });
    });
    it('should return true if extractAsync ultra_lite with default options working ultra lite', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzultra.extractAsync(query, choices, {}, function (err, results) {
            assert.equal(results[0][1], 100);
            assert.equal(results[1][1], 80);
            assert.equal(results[2][1], 60);
            assert.equal(results[1][0], 'koala bear');
            done();
        });
    });

    it('should return true if extractAsync with options.returnObjects = true is working', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzz.extractAsync(query, choices, {returnObjects: true}, function (err, results) {
            assert.equal(results[0].score, 100);
            assert.equal(results[1].score, 80);
            assert.equal(results[2].score, 60);
            assert.equal(results[1].choice, 'koala bear');
            done();
        });
    });
    it('should return true if extractAsync lite with options.returnObjects = true is working lite', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzlite.extractAsync(query, choices, { returnObjects: true}, function (err, results) {
            assert.equal(results[0].score, 100);
            assert.equal(results[1].score, 80);
            assert.equal(results[2].score, 60);
            assert.equal(results[1].choice, 'koala bear');
            done();
        });
    });
    it('should return true if extractAsync ultra_lite with options.returnObjects = true is working ultra lite', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzultra.extractAsync(query, choices, { returnObjects: true}, function (err, results) {
            assert.equal(results[0].score, 100);
            assert.equal(results[1].score, 80);
            assert.equal(results[2].score, 60);
            assert.equal(results[1].choice, 'koala bear');
            done();
        });
    });
});

describe('errors', function () {
    it('should return error from extractAsync with invalid choices', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzz.extractAsync(query, 'not a valid choices obj', {}, function (err, results) {
            assert.equal(err.message, "Invalid choices");
            done();
        });
    });
    it('should return error from extractAsync with invalid choices lite', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzlite.extractAsync(query, 'not a valid choices obj', {}, function (err, results) {
            assert.equal(err.message, "Invalid choices");
            done();
        });
    });
    it('should return error from extractAsync with invalid choices ultra_lite', function (done) {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        fuzzultra.extractAsync(query, 'not a valid choices obj', {}, function (err, results) {
            assert.equal(err.message, "Invalid choices");
            done();
        });
    });
    it('should return error from extract with invalid choices', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        try {
            var results = fuzz.extract(query, 'not a valid choices obj', {});
        }
        catch (err) {
            assert.equal(err.message, "Invalid choices");
        }
    });
    it('should return error from extract with invalid choices lite', function () {
        var query = "polar bear";
        var choices = ["brown bear", "polar bear", "koala bear"];
        try {
            var results = fuzzlite.extract(query, 'not a valid choices obj', {});
        }
        catch (err) {
            assert.equal(err.message, "Invalid choices");
        }
    });
});

describe('full_process with unicode alphanumeric regex', function () {
    it('should have a with dots in output', function () {
        assert.equal(fuzz.full_process("_myt^eäXt!"), "myt eäxt");
    });
    it('should not have a with dots in output', function () {
        assert.equal(fuzz.full_process("_myt^eäXt!", true), "myt ext");
    });
});

describe('full_process with unicode alphanumeric regex lite', function () {
    it('should have a with dots in output', function () {
        assert.equal(fuzzlite.full_process("myt^eäXt!"), "myt eäxt");
    });
    it('should not have a with dots in output', function () {
        assert.equal(fuzzlite.full_process("myt^eäXt!", true), "myt ext");
    });
});

describe('collation', function () {
    // only test supported runtimes
    if (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") {
        it('should be 100 with collation', function () {
            assert.equal(100, fuzz.ratio("myt^eäXt!", "myt^eaXt!", { useCollator: true }));
        });
        it('should not be 100 without collation', function () {
            assert.notEqual(100, fuzz.ratio("myt^eäXt!", "myt^eaXt!"));
        });
        it('should be 100 with collation lite', function () {
            assert.equal(100, fuzzlite.ratio("myt^eäXt!", "myt^eaXt!", { useCollator: true }));
        });
        it('should not be 100 without collation lite', function () {
            assert.notEqual(100, fuzzlite.ratio("myt^eäXt!", "myt^eaXt!"));
        });
        it('should be 100 with collation astral', function () {
            assert.equal(100, fuzz.ratio("polar bear mañanä", "polar bear mañana", { useCollator: true, astral: true }));
        });
        it('should be 100 with collation astral lite', function () {
            assert.equal(100, fuzzlite.ratio("polar bear mañanä", "polar bear mañana", { useCollator: true, astral: true }));
        });
    }
});

describe('trySimple', function () {
    it('should match ratio with trySimple on', function () {
        assert.equal(fuzz.token_set_ratio('mr. harry hood', 'Mr.xarry wood', { trySimple: true }), fuzz.ratio('mr. harry hood', 'Mr.xarry wood'));
    });
    it('should match ratio with trySimple on lite', function () {
        assert.equal(fuzzlite.token_set_ratio('mr. harry hood', 'Mr.xarry wood', { trySimple: true }), fuzzlite.ratio('mr. harry hood', 'Mr.xarry wood'));
    });
    it('should match ratio with trySimple on extract', function () {
        assert.equal(fuzz.extract('mr. harry hood', ['Mr.xarry wood'], { trySimple: true, scorer: fuzz.token_set_ratio })[0][1], fuzz.ratio('mr. harry hood', 'Mr.xarry wood'));
    });
    it('should match ratio with trySimple on extract lite', function () {
        assert.equal(fuzzlite.extract('mr. harry hood', ['Mr.xarry wood'], { trySimple: true, scorer: fuzzlite.token_set_ratio })[0][1], fuzzlite.ratio('mr. harry hood', 'Mr.xarry wood'));
    });
});

describe('wildcards', function () {
    /* it('should match ratio with trySimple on and wildcard', function () { //not true anymore with wildcard aware set ops
        assert.equal(fuzz.token_set_ratio('mr. harry hood', 'Mr.xarry wood', { trySimple: true, wildcards: 'x' }), fuzz.ratio('mr. harry hood', 'Mr.xarry wood', {wildcards: 'x'}));
    }); */
    it('should match ratio with trySimple on and wildcard lite', function () {
        assert.equal(fuzzlite.token_set_ratio('mr. harry hood', 'Mr.xarry wood', { trySimple: true, wildcards: 'x' }), fuzzlite.ratio('mr. harry hood', 'Mr.xarry wood', { wildcards: 'x' }));
    });
    it('token_set_ratio should be equal with wildcards (when doesnt affect sort order)', function () {
        var options = { wildcards: '^*#x' };
        assert.equal(fuzz.token_set_ratio('mr. h*rry hood', 'Mr.xarry wox#', options), fuzz.token_set_ratio('mr. harry hood', 'Mr.xarry wood', options));
    });
    it('token_set_ratio should be equal with wildcards (when doesnt affect sort order) lite', function () {
        var options = { wildcards: '^*#x' };
        assert.equal(fuzzlite.token_set_ratio('mr. h*rry hood', 'Mr.xarry wox#', options), fuzzlite.token_set_ratio('mr. harry hood', 'Mr.xarry wood', options));
    });
    it('ratio should be equal with wildcards', function () {
        var options = { wildcards: '^*#x' };
        assert.equal(fuzz.ratio('mr. h*rry hood', 'Mr.xarry wox#', options), fuzz.ratio('mr. harry hood', 'Mr.xarry wood', options));
    });
    it('ratio should be equal with wildcards lite', function () {
        var options = { wildcards: '^*#x' };
        assert.equal(fuzzlite.ratio('mr. h*rry hood', 'M^.xarry wox#', options), fuzzlite.ratio('mr. harry hood', 'Mr.xarry wood', options));
    });
    it('wildcards should be case sensitive when no full process', function () {
        var options = { wildcards: '^*#x', full_process: false };
        assert.notEqual(fuzz.ratio('mr. h*rry hood', 'mr. h*rry Xood', options), 100);
    });
    it('wildcards should be case sensitive when no full process lite', function () {
        var options = { wildcards: '^*#x', full_process: false };
        assert.notEqual(fuzzlite.ratio('mr. h*rry hood', 'mr. h*rry Xood', options), 100);
    });
    it('wildcards should be case insensitive when full process', function () {
        var options = { wildcards: '^*#x', full_process: true };
        assert.equal(fuzz.ratio('mr. h*rry hood', 'mr. h*rry Xood', options), 100);
    });
    it('wildcards should be case insensitive when full process lite', function () {
        var options = { wildcards: '^*#x', full_process: true };
        assert.equal(fuzzlite.ratio('mr. h*rry hood', 'mr. h*rry Xood', options), 100);
    });
});

describe('dedupe', function () {
    it('should remove the dupes from array of strings', function () {
        var contains_dupes = ['a', 'a', 'loldupe', 'lolduped', 'wat', 'nolan rules', 'nolan rulez'];
        assert.equal(4, fuzz.dedupe(contains_dupes).length);
    });
    it('should remove the dupes from object of strings', function () {
        var contains_dupes = {a:'a', b:'a', c:'loldupe', d:'lolduped', e:'wat', f:'nolan rules', g:'nolan rulez'};
        assert.equal(4, fuzz.dedupe(contains_dupes).length);
    });
    it('should remove the dupes from object of arrays with processor', function () {
        var contains_dupes = { a: ['a'], b: ['a'], c: ['loldupe'], d: ['lolduped'], e: ['wat'], f: ['nolan rules'], g: ['nolan rulez'] };
        var options = { processor: function(x) { return x[0] } }
        assert.equal(4, fuzz.dedupe(contains_dupes, options).length);
    });
    it('should remove the dupes from array of strings with non-default scorer', function () {
        var contains_dupes = ['a', 'a', 'loldupe', 'lolduped', 'wat', 'nolan rules', 'nolan rulez'];
        var options = {scorer: fuzz.token_set_ratio}
        assert.equal(4, fuzz.dedupe(contains_dupes, options).length);
    });
});

describe('dedupe lite', function () {
    it('should remove the dupes from array of strings', function () {
        var contains_dupes = ['a', 'a', 'loldupe', 'lolduped', 'wat', 'nolan rules', 'nolan rulez'];
        assert.equal(4, fuzzlite.dedupe(contains_dupes).length);
    });
    it('should remove the dupes from object of strings', function () {
        var contains_dupes = { a: 'a', b: 'a', c: 'loldupe', d: 'lolduped', e: 'wat', f: 'nolan rules', g: 'nolan rulez' };
        assert.equal(4, fuzzlite.dedupe(contains_dupes).length);
    });
    it('should remove the dupes from object of arrays with processor', function () {
        var contains_dupes = { a: ['a'], b: ['a'], c: ['loldupe'], d: ['lolduped'], e: ['wat'], f: ['nolan rules'], g: ['nolan rulez'] };
        var options = { processor: function (x) { return x[0] } }
        assert.equal(4, fuzzlite.dedupe(contains_dupes, options).length);
    });
    it('should remove the dupes from array of strings with non-default scorer', function () {
        var contains_dupes = ['a', 'a', 'loldupe', 'lolduped', 'wat', 'nolan rules', 'nolan rulez'];
        var options = { scorer: fuzzlite.token_set_ratio }
        assert.equal(4, fuzzlite.dedupe(contains_dupes, options).length);
    });
    it('should remove the dupes from array of strings and keep the dupe map', function () {
        var contains_dupes = ['a', 'a', 'loldupe', 'lolduped', 'wat', 'nolan rules', 'nolan rulez'];
        var options = {keepmap: true};
        assert.equal(4, fuzzlite.dedupe(contains_dupes, options).length);
        assert.equal(3, fuzzlite.dedupe(contains_dupes, options)[2].length);
    });
});

describe('collapse whitespace', function () {
    it('should be 100 when whitespace collapsed', function () {
        assert.equal(100, fuzz.ratio('x y', 'x     y', {collapseWhitespace: true}));
    });
    it('should collapse by default', function () {
        assert.equal(100, fuzz.ratio('x y', 'x     y'));
    });
    it('should not be 100 when whitespace collapsed', function () {
        assert.notEqual(100, fuzz.ratio('x y', 'x     y', { collapseWhitespace: false }));
    });
});

describe('subcost is 2', function () {
    it('should return true if subcost 2', function () {
        assert.equal(fuzz.ratio("qwe", "qwx"), 67);
        assert.equal(fuzz.ratio("qwe", "qwx", {wildcards: 'z'}), 67);
    });
    it('should return true if subcost 2', function () {
        assert.equal(fuzzlite.ratio("qwe", "qwx"), 67);
        assert.equal(fuzzlite.ratio("qwe", "qwx", { wildcards: 'z' }), 67);
    });
    it('should return true if subcost 2', function () {
        assert.equal(fuzzultra.ratio("qwe", "qwx"), 67);
        assert.equal(fuzzultra.ratio("qwe", "qwx", { wildcards: 'z' }), 67);
    });
});

describe('subcost is 1 for distance', function () {
    it('should return true if subcost 2', function () {
        assert.equal(fuzz.distance("qwe", "qwx"), 1);
        assert.equal(fuzz.distance("qwe", "qwx", { wildcards: 'z' }), 1);
    });
    it('should return true if subcost 2', function () {
        assert.equal(fuzzlite.distance("qwe", "qwx"), 1);
        assert.equal(fuzzlite.distance("qwe", "qwx", { wildcards: 'z' }), 1);
    });
    it('should return true if subcost 2', function () {
        assert.equal(fuzzultra.distance("qwe", "qwx"), 1);
        assert.equal(fuzzultra.distance("qwe", "qwx", { wildcards: 'z' }), 1);
    });
});

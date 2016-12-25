var assert = require('assert');
var fuzz = require('../fuzzball');
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

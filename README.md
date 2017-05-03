 [![Build Status](https://travis-ci.org/nol13/fuzzball.js.svg?branch=master)](https://travis-ci.org/nol13/fuzzball.js) [![Try fuzzball on RunKit](https://badge.runkitcdn.com/fuzzball.svg)](https://runkit.com/npm/fuzzball)

![fuzzball.js logo](fuzzballlogo.jpg "feed me strings!")
==========
Easy to use and powerful fuzzy string matching.

This is (mostly) a JavaScript port of the [fuzzywuzzy](https://github.com/seatgeek/fuzzywuzzy) Python library. Uses [leven](https://github.com/sindresorhus/leven) for distance calculations. (with a bit of code from [fast-levenshtein](https://github.com/hiddentao/fast-levenshtein) patched on)

# Contents
 * [Installation](#installation)
 * [Usage and Scoring Overview](#usage)
 * [Pre-Processing](#pre-processing)
 * [Collation and Unicode Stuff](#collation-and-unicode-stuff)
 * [Batch Extract](#batch-extract)
 * [Multiple Fields](#multiple-fields)
 * [Wildcards](#wildcards)
 * [Fuzzy Dedupe](#fuzzy-dedupe)
 * [Performance Optimization](#performance-optimization)
 * [Alternate Ratio Calculations](#alternate-ratio-calculations)

# Installation

**Using NPM**

```
npm install fuzzball
```

**Browser** (charset must be utf-8)

```html
<script charset="UTF-8" src="dist/fuzzball.umd.min.js"></script>
<script>
fuzzball.ratio("fuzz", "fuzzy")
</script>
```
You can use the file __lite/fuzzball_lite.umd.min.js__ instead if you don't need the partial ratios. This version has a somewhat smaller file size but doesn't include the partial ratios which require difflib. Now using UMD format but the old browser bundles still provided for backwards compatability.

# Usage

**Basic Overview**

```js
var fuzz = require('fuzzball');
fuzz.ratio("hello world", "hiyyo wyrld");
        64

var options = {scorer: fuzz.token_set_ratio};
var choices = ["Hood, Harry", "Mr. Minor", "Mr. Henry Hood"];
fuzz.extract("mr. harry hood", choices, options);

// [choice, score, index/key]
[ [ 'Hood, Harry', 100, 0 ],
  [ 'Mr. Henry Hood', 85, 2 ],
  [ 'Mr. Minor', 40, 1 ] ]

fuzz.extractAsync("mr. harry hood", choices, options, function (err, results){/* do stuff */});
```

**Simple Ratio**

```js
fuzz.ratio("this is a test", "this is a test!"); // "!" stripped in pre-processing by default
        100
```

**Partial Ratio** 

Highest scoring substring of the longer string vs. the shorter string.

```js
fuzz.partial_ratio("test", "testing"); //still 100, substring of 2nd is a perfect match of the first
        100
```

**Token Sort Ratio**

Tokenized, sorted, and then recombined before scoring.
```js
fuzz.ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear");
        91
fuzz.token_sort_ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear");
        100
```

**Token Set Ratio** 

Highest of 3 scores comparing the set intersection, intersection + difference 1 to 2, and intersection + difference 2 to 1.
```js
fuzz.token_sort_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear");
        84
fuzz.token_set_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear"); 
        100
```
If you set options.trySimple to true it will add the simple ratio to the token_set_ratio test suite as well. This can help smooth out occational irregularities in how much differences in the first letter of a token will get penalized.

**Distance**

Unmodified Levenshtein distance without any additional ratio calculations.
```js
fuzz.distance("fuzzy was a bear", "fozzy was a bear");
        1
```

**Other Scoring Options**

  * partial_token_set_ratio (options.trySimple = true will add the partial_ratio to the test suite, note this function will always return 100 if there are any tokens in common)
  * partial_token_sort_ratio
  * WRatio (runs tests based on relative string length and returns weighted top score, current default scorer in fuzzywuzzy extract)

Blog post with overview of scoring algorithms can be found [**here**](http://chairnerd.seatgeek.com/fuzzywuzzy-fuzzy-string-matching-in-python/).

### Pre-Processing

Pre-processing to remove non-alphanumeric characters run by default unless options.full_process is set to false.
```js
// eh, don't need to clean it up..
// set options.force_ascii to true to remove all non-ascii letters as well, default: false
fuzz.ratio("this is a test", "this is a test!", {full_process: false});
        97
```

Or run separately.. (run beforehand to avoid a bit of performance overhead)
```js
// force_ascii will strip out non-ascii characters except designated wildcards
fuzz.full_process("myt^eäXt!");
        myt eäxt
fuzz.full_process("myt^eäXt!", {force_ascii: true});
        myt ext
```

### Collation and Unicode Stuff

To use collation when calculating edit distance, set **useCollator** to true. Will be ignored if Intl.Collator does not exist in your enviroment. (node 0.10 and under, IE10 and under)

Setting useCollator to true will have an impact on performance, so if you have really large number of choices may be best to pre-process (i.e. lodash _.deburr) instead if possible.

```js
var options = {useCollator: true};
fuzz.ratio("this is ä test", "this is a test", options);
        100
```

If your strings contain code points beyond the basic multilingual plane (BMP), set **astral** to true. If your strings contain astral symbols and this is not set, those symbols will be treated as multiple characters and the ratio will be off a bit. (This will have some impact on performance, which is why it is turned off by default.) 

```js
var options = {astral: true};
fuzz.ratio("ab🐴c", "ab🐴d", options);
        75
```
**If astral is set to true, full_process will be set to false automatically, as the current alphanumeric check only supports BMP.**

When astral is true it will also normalize your strings before scoring, as long as String.prototype.normalize exists in your environment, but will not attempt to polyfill. (So if you need to compare unnormalized strings in IE, normalize separately) You can set the **normalize** option to false if you want different representations not to match, but is true by default.

### Batch Extract 
Search list of choices for top results.

###### fuzz.extract(query, choices, options);

###### fuzz.extractAsync(query, choices, options, function(err, results) { /* do stuff */ }); (internal loop will be non-blocking)

**Simple:** array of strings, or object in form of {key: "string"}

The scorer defaults to fuzz.ratio if not specified.

With array of strings
```js
var query = "polar bear";
var choices = ["brown bear", "polar bear", "koala bear"];

var results = fuzz.extract(query, choices);

// [choice, score, index]
[ [ 'polar bear', 100, 1 ],
  [ 'koala bear', 80, 2 ],
  [ 'brown bear', 60, 0 ] ]
```

With object
```js
var query = "polar bear";
var choicesObj = {id1: "brown bear", id2: "polar bear", id3: "koala bear"};

var results = fuzz.extract(query, choicesObj);

// [choice, score, key]
[ [ 'polar bear', 100, 'id2' ],
  [ 'koala bear', 80, 'id3' ],
  [ 'brown bear', 60, 'id1' ] ]
```

**Less simple:** array of objects, or object in form of {key: choice}, with processor function + options

Optional processor function takes a choice and returns the string which will be used for scoring. Each choice can be a string or an object, as long as the processor function can accept it and return a string.
```js
var query = "126abzx";
var choices = [{id: 345, modelnumber: "123abc"},{id: 346, modelnumber: "123efg"},{id: 347, modelnumber: "456abdzx"}];
var options = {
        scorer: fuzz.partial_ratio, // any function that takes two values and returns a score, default: ratio
        processor: function(choice) {return choice['modelnumber']},  //takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
        limit: 2, // max number of top results to return, default: no limit / 0.
        cutoff: 50, // lowest score to return, default: 0
        unsorted: false // results won't be sorted if true, default: false. If true limit will be ignored.
};

var results = fuzz.extract(query, choices, options);

// [choice, score, index/key]
[ [ { id: 347, modelnumber: '456abdzx' }, 71, 2 ],
  [ { id: 345, modelnumber: '123abc' }, 67, 0 ] ]
```

The processor function will only run on choices, so if your processor function modifies text in any way be sure to do the same to your query for unbiased results. This and default scorer are a slight departure from current fuzzywuzzy behavior.

### Multiple Fields

If you want to use more than one field for scoring, can do stuff like combine two fields in a processor function before scoring.

```js
var processor = function(choice) { return choice['field1'] + " " + choice['field2']; }
```

For more complex behavior you can provide a custom scorer, say for a weighted score of two fields, or to include additional types of data. When using a custom scorer both the query and each choice can be any type of value, as long as your scorer can handle the respective parameters correctly.

```js
var query = {name: "tiger", gender: "female"}
var choices = [{name: "tiger", gender: "female"},{name: "tigger", gender: "male"},{name: "lulav", gender: "female"}, {name: "chad ochocinco", gender: "male"}]
function myCustomScorer(query, choice, options) {
        if (query.gender !== choice.gender) return 0;
        else return fuzz.ratio(query.name, choice.name, options);
}
var options = {scorer: myCustomScorer}
var results = fuzz.extract(query, choices, options);
```

(if you still wanted to use a separate processor function for whatever reason, the processor function would need to return something your scorer accepts)

### Wildcards

Set options.wildcards to a string containing wildcard characters to be used as wildcards when calculating edit distance. Each character in the string will be treated as a wildcard, and wildcards are **case insensitive** unless options.full_process is set to false.

```js
var options = {wildcards: "*x"}; // '*' and 'x' are both wildcards
fuzz.ratio('fuzzba*l', 'fuXxball', options);
        100
```
Note: Wildcards are currently **not supported** when astral is set to true. Also the sorting for the algorithms that depend on token sort order will not take them into account, and when calculating the unique tokens in a string, say for example 'fuzz' and 'f*zz', would be considered different tokens. They would still score higher than they would without using wildcards in almost all cases though.

### Fuzzy Dedupe

Convenience function to take a list of items containing duplicates and uses fuzzy matching to identify and remove duplicates. Uses extract to identify duplicates that score greater than a user defined threshold/cutoff. Then, it looks for the longest item in the duplicate list since we assume this item contains the most entity information and returns that. It breaks string length ties on an alphabetical sort.

To keep the map of which items were matched with each unique value set options.keepmap = true. Other than that, available options are the same as in extract except that the cutoff will default to 70 if not supplied, limit will be ignored if given, and each item must either be a string, or if using a processor function the post-processed item must be a string.

Note: as the cutoff DECREASES the number of duplicates that are found INCREASES. This means that the returned deduplicated list will likely be shorter. Raise the threshold for fuzzy_dedupe to be less sensitive.

```js
var contains_dupes = ['fuzzy wuzzy', 'fuzzy wuzz', 'not a dupe'];
options = {cutoff: 85, scorer: fuzz.token_set_ratio}
fuzz.dedupe(contains_dupes, options)

// [item, index/key of item in original list]
[ [ 'fuzzy wuzzy', 0 ],
  [ 'not a dupe', 2 ] ]

options.keepmap = true;
fuzz.dedupe(contains_dupes, options)

// [item, index/key of item in original list, [output of fuzz.extract for item]]
[ [ 'fuzzy wuzzy', 0, [ [Object], [Object] ] ],
  [ 'not a dupe', 2, [ [Object] ] ] ]
```

### Performance Optimization

If you have a large list of terms that you're searching repeatedly, and you need to boost performance, can do some of the processing beforehand. For all scorers you can run full_process() on all of the choices beforehand, and then set options.full_process to false. With the token scorers you can run some of the additional processing beforehand. Exactly how depends on if using with the extract function or as standalone functions. (Also, f you wanted to use an alternate tokenizer could sub them for the functions used below)

If using either "token_sort" scorer with the extract function: You can set the property "proc_sorted" of each choice object and it will use that instead of running process_and_sort() again. (Will need to make sure each choice is an object, even if just "choice = new String(choice)")

```js
var query = fuzz.full_process("126-Abzx");
var choices = [{id: 345, modelnumber: "123-abc"},{id: 346, modelnumber: "efg-123"},{id: 347, modelnumber: "456 abdzx"}];
for (var c in choices) {
        choices[c].proc_sorted = fuzz.process_and_sort(fuzz.full_process(choices[c].modelnumber));
}
var options = {
        scorer: fuzz.token_sort_ratio,
        processor: function(choice) {return choice['modelnumber']}, //choice.proc_sorted will override this
        full_process: false
};
var results = fuzz.extract(query, choices, options);
```

If using either "token_sort" scorer as standalone functions: Set options.proc_sorted = true and process both strings beforehand.

```js
var str1 = "Abe Lincoln";
var str2 = "Lincoln, Abe";

str1 = fuzz.process_and_sort(fuzz.full_process(str1));
str2 = fuzz.process_and_sort(fuzz.full_process(str2));
fuzz.token_sort_ratio(str1, str2, {proc_sorted: true});
        100
```

If using either "token_set" scorer with extract: You can set the property "tokens" of each choice object and it will use that instead of running unique_tokens() again. (Will need to make sure each choice is an object, even if just "choice = new String(choice)")

```js
var query = fuzz.full_process("126-Abzx");
var choices = [{id: 345, modelnumber: "123-abc"},{id: 346, modelnumber: "efg-123"},{id: 347, modelnumber: "456 abdzx"}];
for (var c in choices) {
        choices[c].tokens = fuzz.unique_tokens(fuzz.full_process(choices[c].modelnumber));
}
var options = {
        scorer: fuzz.token_set_ratio,
        processor: function(choice) {return choice['modelnumber']}, //choice.tokens will override this
        full_process: false
};
var results = fuzz.extract(query, choices, options);
```

If using either "token_set" scorer as standalone functions: Tokenize both strings beforehand and attach them to options.tokens as a two element array.

```js
var str1 = "fluffy head man";
var str2 = "heady fluffy head";

str1_tokens = fuzz.unique_tokens(fuzz.full_process(str1));
str2_tokens = fuzz.unique_tokens(fuzz.full_process(str2));

var options = {tokens: [str1_tokens, str2_tokens]};

// still have to include first two args for validation but they won't be used for scoring
fuzz.token_set_ratio(str1, str2, options);
        85
```



### Alternate Ratio Calculations


If you want to use difflib's ratio function for all ratio calculations, which differs slightly from the default python-Levenshtein style behavior, you can specify options.ratio_alg = "difflib". The difflib calculation is a bit different in that it's based on matching characters rather than true minimum edit distance, but the results are usually pretty similar. Difflib uses the formula 2.0*M / T  where M is the number of matches, and T is the total number of elements in both sequences. This mirrors the behavior of fuzzywuzzy when not using python-Levenshtein.

Except when using difflib, the ratios are calculated as ((str1.length + str2.length) - distance) / (str1.length + str2.length), where distance is calculated with a substitution cost of 2. This follows the behavior of python-Levenshtein, however the fuzz.distance function still uses a cost of 1 by default for all operations if just calculating distance and not a ratio.

Setting options.useCollator only works at this time if using the default algorithm.

Fuzzball.js
==========

Easy to use and powerful fuzzy string matching. 

This is a JavaScript port of the [fuzzywuzzy](https://github.com/seatgeek/fuzzywuzzy) Python library. Uses [fast-levenshtein](https://github.com/hiddentao/fast-levenshtein) for distance calculations.

Try it out on [runkit](https://runkit.com/npm/fuzzball)!

Requirements
============

-  jsdifflib
-  heap.js

Installation
============

Using NPM

    npm install fuzzball

Usage
=====

```js
var fuzz = require('fuzzball');
fuzz.ratio("this is a test", "this is a test");
        100
```

**Browser**

```js
<script src="fuzzball_browser.js"></script>
```
```js
<script>
var fuzz = require('fuzzball');
alert(fuzz.ratio("hello world", "hiyyo wyrld"));
</script>
```

**Simple Ratio**

```js
fuzz.ratio("this is a test", "this is a test!"); // "!" stripped in pre-processing by default
        100
```

**Partial Ratio**

```js
fuzz.partial_ratio("this is a test", "this is a test!");
        100
fuzz.partial_ratio("this is a test", "this is a test again!"); //still 100, substring of 2nd is a perfect match of the first
        100
```

**Token Sort Ratio**

```js
fuzz.ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear");
        91
fuzz.token_sort_ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear");
        100
```

**Token Set Ratio** 

```js
fuzz.token_sort_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear");
        84
fuzz.token_set_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear"); 
        100
```

**Distance** (Levenshtein distance without any ratio calculations)

```js
fuzz.distance("fuzzy was a bear", "fozzy was a bear");
        1
```

**Other Scoring Options**

  * partial_token_set_ratio
  * partial_token_sort_ratio
  * WRatio
(WRatio is weighted based on relative string length, runs tests based on relative length and returns top score)

Blog post with overview of scoring algorithms can be found [**here**](http://chairnerd.seatgeek.com/fuzzywuzzy-fuzzy-string-matching-in-python/).

**Pre-Processing**

```js
// eh, don't need to clean it up..
var options = {full_process: false}; //non-alphanumeric will not be converted to whitespace if false, default true
fuzz.ratio("this is a test", "this is a test!", options);
        97
```

Pre-processing run by default unless options.full_process is set to false, but can run separately as well. (so if searching same list repeatedly can only run once)

```js
fuzz.full_process("myt^eXt!");
        myt ext
```

**International** (a.k.a. non-ascii)

```js
// currently full_process must be set to false if useCollator is true
// or non-roman alphanumeric will be removed (got a good locale-specific alphanumeric check in js?)
var options = {full_process: false, useCollator: true};
fuzz.ratio("this is ä test", "this is a test", options);
        100
```

**Extract** (search a list of choices for top results)

Simple: array of strings

```js
var query = "polar bear";
var choices = ["brown bear", "polar bear", "koala bear"];

results = fuzz.extract(query, choices);

[ [ 'polar bear', 100 ],
  [ 'koala bear', 80 ],
  [ 'brown bear', 60 ] ]
```

Less simple: array of objects with options

Processor function takes a choice and returns a string which will be used for scoring. Default scorer is ratio.

```js
var query = "126abzx";
var choices = [{id: 345, modelnumber: "123abc"},{id: 346, modelnumber: "123efg"},{id: 347, modelnumber: "456abdzx"}];
var options = {
        scorer: fuzz.partial_ratio,
        processor: function(choice) {return choice['modelnumber']},
        limit: 2, // max number of results, default: no limit
        cutoff: 50 // lowest score to return, default: 0
};

results = fuzz.extract(query, choices, options);

[ [ { id: 347, modelnumber: '456abdzx' }, 71 ],
  [ { id: 345, modelnumber: '123abc' }, 67 ] ]

```

**Alternate Ratio Calculation**

If you want to use difflib's ratio function for all ratio calculations, which differs slightly from the default python-Levenshtein style behavior, you can specify options.difflib_ratio = true. In python-Levenshtein they set the substitution cost to 2 when calculating ratios, which I follow. The distance function still uses a cost of 1 by default though, you can override either by passing in an options.subcost.

The difflib calculation is a bit different in that it's based on matching characters rather than true minimum edit distance, but the results are usually pretty similar. See the documentation of the relevant project for details.
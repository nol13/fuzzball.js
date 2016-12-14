Fuzzball.js
==========

Easy to use and powerful fuzzy string matching. 

This is a JavaScript port of <https://github.com/seatgeek/fuzzywuzzy>. Uses fast-levenshtein <https://github.com/hiddentao/fast-levenshtein> for distance calculations, with a slight modification to match the behavior of python-Levenshtein. (substitutions are weighted 2 instead of 1 in ratio calculations.

Try it out: <https://runkit.com/npm/fuzzball>

Requirements
============

-  difflib.js   (for the scorers that use partial_ratio)

Installation
============

Using NPM

    npm install fuzzball

Usage
=====

```javascript
var fuzz = require('fuzzball');
fuzz.ratio("this is a test", "this is a test!")
        100

// eh, don't need to clean it up..
var options = {full_process: false}; //non-alphanumeric will not be converted whitespace if false, default true
fuzz.ratio("this is a test", "this is a test!", options) 
        97
```

Simple Ratio

```
fuzz.ratio("this is a test", "this is a test!")
        100
```

Partial Ratio

```
fuzz.partial_ratio("this is a test", "this is a test!")
        100
fuzz.partial_ratio("this is a test", "this is a test!", {full_process: false}) //still 100
        100
```

Token Sort Ratio


```
fuzz.ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear")
        91
fuzz.token_sort_ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear")
        100
```

Token Set Ratio


```
fuzz.token_sort_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear")
        84
fuzz.token_set_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear")
        100
```

International

```
// full_process must be set to false if useCollator is true
// or non-roman alphanumeric will be removed (got a good locale-specific alphanumeric check in js?)
var options = {full_process: false, useCollator: true};
fuzz.ratio("this is ä test", "this is a test", options)
        100
```


Extract (search a list of choices for top results)

Simple: array of strings
```
var query = "polar bear";
var choices = ["brown bear", "polar bear", "koala bear"];

results = fuzz.extract(query, choices);

[ [ 'polar bear', 100 ],
  [ 'koala bear', 80 ],
  [ 'brown bear', 60 ] ]
```

Less simple: array of objects with a procesor function + options
```
var query = "126abzx";
var choices = [{id: 345, modelnumber: "123abc"},{id: 346, modelnumber: "123efg"},{id: 347, modelnumber: "456abdzx"}];
var scorer = fuzz.ratio;
var processor = function(choice) {return choice['modelnumber']}
var limit = 2; // max number of results
var cutoff = 50; // lowest score to return
var options = {}; 

results = fuzz.extract(query, choices, scorer, processor, limit, cutoff, options);

[ [ { id: 345, modelnumber: '123abc' }, 67 ],
 [ { id: 347, modelnumber: '456abdzx' }, 57 ] ]
```

Fuzzball.js
==========

Fuzzy string matching like a boss. It uses Levenshtein Distance <https://en.wikipedia.org/wiki/Levenshtein_distance>`_ to calculate the differences between sequences in a simple-to-use package.
This is (mostly) a JavaScript port of <https://github.com/seatgeek/fuzzywuzzy>. Uses fast-levenshtein <https://github.com/seatgeek/fuzzywuzzy> for distance calculations, with a slight modification to match the behavior of python_levenshtein. (substitutions are weighted 2 instead of 1 in ratio calculations.

Requirements
============

-  difflib.js   (for the scorers that use partial_ratio)

Installation
============

Using NPM

.. code:: bash

    npm install fuzzball

Usage
=====

```javascript
var fuzz = require('fuzzball');
fuzz.ratio("this is a test", "this is a test!")
        100
var options = {full_process: false};
fuzz.ratio("this is a test", "this is a test!", options) // eh, don't need to clean it up..
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

Process


```
var query = "polar bear";
var choices = ["brown bear", "polar bear", "koala bear"];

results = fuzz.extract(query, choices);
        [ [ { id: 345, modelnumber: '123abc' }, 67 ], [ { id: 347, modelnumber: '456abdzx' }, 57 ] ]
```


```
var query = "126abzx";
var choices = [{id: 345, modelnumber: "123abc"},{id: 346, modelnumber: "123efg"},{id: 347, modelnumber: "456abdzx"}];
var scorer = fuzz.ratio;
var processor = function(choice) {return choice['modelnumber']}
var limit = 2; /** max number of results */
var cutoff = 50; /** lowest score to return */

results = fuzz.extract(query, choices, scorer, processor, limit, cutoff);
        [ [ { id: 345, modelnumber: '123abc' }, 67 ], [ { id: 347, modelnumber: '456abdzx' }, 57 ] ]
```

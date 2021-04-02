 [![Build Status](https://travis-ci.org/nol13/fuzzball.js.svg?branch=master)](https://travis-ci.org/nol13/fuzzball.js) [![Try fuzzball on RunKit](https://badge.runkitcdn.com/fuzzball.svg)](https://runkit.com/npm/fuzzball)

![fuzzball.js logo](fuzzballlogo.jpg "feed me strings!")
==========
Easy to use and powerful fuzzy string matching. 

Mostly a JavaScript port of the [fuzzywuzzy](https://github.com/seatgeek/fuzzywuzzy) Python library, with some cool added features.

Demo <a href="https://nol13.github.io/fuzzball.js" target="_blank">here</a> comparing some of the different scorers/options. Auto-generated API Docs <a href="https://github.com/nol13/fuzzball.js/blob/master/jsdocs/fuzzball.md" target="_blank">here</a>. 

# Contents
 * [Installation](#installation)
 * [Usage and Scoring Overview](#usage)
 * [Pre-Processing](#pre-processing)
 * [Collation and Unicode Stuff](#collation-and-unicode-stuff)
 * [Batch Extract](#batch-extract)
 * [Multiple Fields](#multiple-fields)
 * [Async and Cancellation](#async-and-cancellation)
 * [Wildcards](#wildcards)
 * [Fuzzy Dedupe](#fuzzy-dedupe)
 * [Performance Optimization](#performance-optimization)
 * [Alternate Ratio Calculations](#alternate-ratio-calculations)
 * [Lite Bundles](#lite-bundles)
 * [Credits](#credits) (aka, projects I stole code from)
 * [Contributions](#contributions)

# Installation

**Using NPM**

```
npm install fuzzball
```

**Browser** (using pre-built umd bundle, make sure script is utf-8 if page isn't already)

```html
<script charset="UTF-8" src="dist/fuzzball.umd.min.js"></script>
<script>
fuzzball.ratio("fuzz", "fuzzy")
</script>
```
For other no-build/standalone environments, use this file as well. Also available are two lite bundles which leave out select features in exchange for a smaller file size. See lite section below.

# Usage

**Basic Overview**

```js
fuzz = require('fuzzball');

fuzz.ratio("hello world", "hiyyo wyrld");
        64

fuzz.token_set_ratio("fuzzy was a bear", "a fuzzy bear fuzzy was");
        100

options = {scorer: fuzz.token_set_ratio};
choices = ["Hood, Harry", "Mr. Minor", "Mr. Henry Hood"];

fuzz.extract("mr. harry hood", choices, options);

// [choice, score, index/key]
[ [ 'Hood, Harry', 100, 0 ],
  [ 'Mr. Henry Hood', 85, 2 ],
  [ 'Mr. Minor', 40, 1 ] ]

/** 
* Set options.returnObjects = true to get back
* an array of {choice, score, key} objects instead of tuples
*/

fuzz.extractAsync("mr. harry hood", choices, options, function (err, results){/* do stuff */});

// In supported environments, Promise will not be polyfilled
fuzz.extractAsPromised("mr. harry hood", choices, options).then(res => {/* do stuff */});

// Cancel search
let cancelToken = {canceled: false};
options.cancelToken = cancelToken;
fuzz.extractAsPromised("gonna get canceled", choices, options)
        .then(res => {/* do stuff */})
        .catch((e) => {
                if (e.message === 'canceled') console.log('I got canceled!') 
        });
cancelToken.canceled = true;
```

**Simple Ratio**

```js
// "!" Stripped and lowercased in pre-processing by default
fuzz.ratio("this is a test", "This is a test!");
        100
```

**Partial Ratio** 

Highest scoring substring of the longer string vs. the shorter string.

```js
// Still 100, substring of 2nd is a perfect match of the first
fuzz.partial_ratio("test", "testing");
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

**Token Similarity Sort Ratio** 

Instead of sorting alphabetically, tokens will be sorted by similarity to the smaller set. Useful if the matching token may have a different first letter, but performs a bit slower. You can also use similarity sorting when calculating token_set_ratio by setting sortBySimilarity to true.

Still somewhat expiremental, not available in the lite builds yet and sorting will not take wildcards or collation into account. Based off this fuzzywuzzy PR by Exquisition. (https://github.com/seatgeek/fuzzywuzzy/pull/296)

```js
fuzz.token_sort_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar')
        58
fuzz.token_set_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar')
        61
fuzz.token_similarity_sort_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar')
        68
fuzz.token_set_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar', {sortBySimilarity: true})
        71
```

**Distance**

Unmodified Levenshtein distance without any additional ratio calculations.
```js
fuzz.distance("fuzzy was a bear", "fozzy was a bear");
        1
```

**Other Scoring Options**

  * partial_token_set_ratio (options.trySimple = true will add the partial_ratio to the test suite, note this function will always return 100 if there are any tokens in common)
  * partial_token_sort_ratio
  * partial_token_similarity_sort_ratio
  * WRatio (runs tests based on relative string length and returns weighted top score, current default scorer in fuzzywuzzy extract)

Blog post with overview of scoring algorithms can be found [**here**](http://chairnerd.seatgeek.com/fuzzywuzzy-fuzzy-string-matching-in-python/).

### Pre-Processing

Pre-processing to remove non-alphanumeric characters run by default unless options.full_process is set to false.
```js
// Eh, don't need to clean it up..
// Set options.force_ascii to true to remove all non-ascii letters as well, default: false
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

Consecutive white space will be collapsed unless options.collapseWhitespace = false, default true. Setting to false will match the behavior in fuzzywuzzy. Only affects the non-token scorers.

### Collation and Unicode Stuff

To use collation when calculating edit distance, set **useCollator** to true. Will be ignored if Intl.Collator does not exist in your enviroment. (node 0.10 and under, IE10 and under)

Setting useCollator to true will have an impact on performance, so if you have really large number of choices may be best to pre-process (i.e. lodash _.deburr) instead if possible.

```js
options = {useCollator: true};
fuzz.ratio("this is ä test", "this is a test", options);
        100
```

If your strings contain code points beyond the basic multilingual plane (BMP), set **astral** to true. If your strings contain astral symbols and this is not set, those symbols will be treated as multiple characters and the ratio will be off a bit. (This will have some impact on performance, which is why it is turned off by default.) 

```js
options = {astral: true};
fuzz.ratio("ab🐴c", "ab🐴d", options);
        75
```
**If astral is set to true, full_process will be set to false automatically, as the current alphanumeric check only supports BMP.**

When astral is true it will also normalize your strings before scoring, as long as String.prototype.normalize exists in your environment, but will not attempt to polyfill. (So if you need to compare unnormalized strings in IE, normalize separately) You can set the **normalize** option to false if you want different representations not to match, but is true by default.

### Batch Extract 
Search list of choices for top results.

###### fuzz.extract(query, choices, options);

###### fuzz.extractAsync(query, choices, options, function(err, results) { /* do stuff */ }); (internal loop will be non-blocking)

###### fuzz.extractAsPromised(query, choices, options).then(results => { /* do stuff */ }); (Promise will not be polyfilled)

**Simple:** array of strings, or object in form of {key: "string"}

The scorer defaults to fuzz.ratio if not specified.

With array of strings
```js
query = "polar bear";
choices = ["brown bear", "polar bear", "koala bear"];

results = fuzz.extract(query, choices);

// [choice, score, index]
[ [ 'polar bear', 100, 1 ],
  [ 'koala bear', 80, 2 ],
  [ 'brown bear', 60, 0 ] ]
```

With object
```js
query = "polar bear";
choicesObj = {id1: "brown bear",
              id2: "polar bear",
              id3: "koala bear"};

results = fuzz.extract(query, choicesObj);

// [choice, score, key]
[ [ 'polar bear', 100, 'id2' ],
  [ 'koala bear', 80, 'id3' ],
  [ 'brown bear', 60, 'id1' ] ]
```

Return objects
```js
options = {returnObjects: true}
results = fuzz.extract(query, choicesObj, options);

[ { choice: 'polar bear', score: 100, key: 'id2' },
  { choice: 'koala bear', score: 80, key: 'id3' },
  { choice: 'brown bear', score: 60, key: 'id1' } ]
```

**Less simple:** array of objects, or object in form of {key: choice}, with processor function + options

Optional processor function takes a choice and returns the string which will be used for scoring. Each choice can be a string or an object, as long as the processor function can accept it and return a string.
```js
query = "126abzx";
choices = [{id: 345, model: "123abc"},
           {id: 346, model: "123efg"},
           {id: 347, model: "456abdzx"}];

options = {
        scorer: fuzz.partial_ratio, // Any function that takes two values and returns a score, default: ratio
        processor: choice => choice.model,  // Takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
        limit: 2, // Max number of top results to return, default: no limit / 0.
        cutoff: 50, // Lowest score to return, default: 0
        unsorted: false // Results won't be sorted if true, default: false. If true limit will be ignored.
};

results = fuzz.extract(query, choices, options);

// [choice, score, index/key]
[ [ { id: 347, model: '456abdzx' }, 71, 2 ],
  [ { id: 345, model: '123abc' }, 67, 0 ] ]
```

The processor function will only run on choices, so if your processor function modifies text in any way be sure to do the same to your query for unbiased results. This and default scorer are a slight departure from current fuzzywuzzy behavior.

### Multiple Fields

If you want to use more than one field for scoring, can do stuff like combine two fields in a processor function before scoring.

```js
processor = choice => choice.field1 + " " + choice.field2;
```

For more complex behavior you can provide a custom scorer, say for a weighted score of two fields, or to include additional types of data. When using a custom scorer both the query and each choice can be any type of value, as long as your scorer can handle the respective parameters correctly.

```js
query = {name: "tiger", gender: "female"}

choices = [{name: "tigger", gender: "male"},
           {name: "lulu", gender: "female"},
           {name: "chad ochocinco", gender: "male"}]

function myCustomScorer(query, choice, options) {
        if (query.gender !== choice.gender) return 0;
        else return fuzz.ratio(query.name, choice.name, options);
}

options = {scorer: myCustomScorer}
results = fuzz.extract(query, choices, options);
```

(if you still wanted to use a separate processor function for whatever reason, the processor function would need to return something your scorer accepts)

### Async and Cancellation

When using extractAsPromised or extractAsync, create a new object with a 'canceled' property to use as a cancel token. For performance, by default only every 256th loop will be async, but set asyncLoopOffset to change. It is most likely not worth changing this.

```js
let cancelToken = {canceled: false};
options.cancelToken = cancelToken;
options.asyncLoopOffset = 64;
fuzz.extractAsPromised("gonna get canceled", choices, options)
        .then(res => {/* do stuff */})
        .catch((e) => {
                if (e.message === 'canceled') console.log('I got canceled!') 
        });

// ...

cancelToken.canceled = true;
```

### Wildcards

Set options.wildcards to a string containing wildcard characters to be used as wildcards when calculating edit distance. Each character in the string will be treated as a wildcard, and wildcards are **case insensitive** unless options.full_process is set to false.

```js
options = {wildcards: "*x"}; // '*' and 'x' are both wildcards
fuzz.ratio('fuzzba*l', 'fuXxball', options);
        100
```
Notes: Wildcards are currently **not supported** when astral is set to true. The set operations in the token_set_ratio's will now take wildcards into account, unless using fuzzball_lite. In fuzzball_lite the set operations are currently still not wildcard aware to avoid the extra dependencies, so the token_set scores in lite when using wildcards will differ.

### Fuzzy Dedupe

Convenience function to take a list of items containing duplicates and uses fuzzy matching to identify and remove duplicates. Uses extract to identify duplicates that score greater than a user defined threshold/cutoff. Then, it looks for the longest item in the duplicate list since we assume this item contains the most entity information and returns that. It breaks string length ties on an alphabetical sort.

To keep the map of which items were matched with each unique value set options.keepmap = true. Other than that, available options are the same as in extract except that the cutoff will default to 70 if not supplied, limit will be ignored if given, and each item must either be a string, or if using a processor function the post-processed item must be a string.

Note: as the cutoff DECREASES the number of duplicates that are found INCREASES. This means that the returned deduplicated list will likely be shorter. Raise the threshold for fuzzy_dedupe to be less sensitive.

```js
contains_dupes = ['fuzzy wuzzy', 'fuzzy wuzz', 'not a dupe'];
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

If you have a large list of terms that you're searching repeatedly, and you need to boost performance, can do some of the processing beforehand. For all scorers you can run full_process() on all of the choices beforehand, and then set options.full_process to false. With the token scorers you can run some of the additional processing beforehand. Exactly how depends on if using with the extract function or as standalone functions. (Also, if you wanted to use an alternate tokenizer could sub them for the functions used below)

If using either "token_sort" scorer with the extract function: You can set the property "proc_sorted" of each choice object and it will use that instead of running process_and_sort() again. If you supply a processor function when proc_sorted is set the processor will not get used. (Will need to make sure each choice is an object, even if just "choice = new String(choice)")

```js
query = fuzz.full_process("126-Abzx");
choices = [{id: 345, model: "123-abc"},
           {id: 346, model: "efg-123"},
           {id: 347, model: "456 abdzx"}];
for (choice of choices) {
        choice.proc_sorted = fuzz.process_and_sort(fuzz.full_process(choice.model));
}
options = {
        scorer: fuzz.token_sort_ratio,
        full_process: false
};
results = fuzz.extract(query, choices, options);
```

If using either "token_sort" scorer as standalone functions: Set options.proc_sorted = true and process both strings beforehand.

```js
str1 = "Abe Lincoln";
str2 = "Lincoln, Abe";

str1 = fuzz.process_and_sort(fuzz.full_process(str1));
str2 = fuzz.process_and_sort(fuzz.full_process(str2));
fuzz.token_sort_ratio(str1, str2, {proc_sorted: true});
        100
```

If using either "token_set" scorer with extract: You can set the property "tokens" of each choice object and it will use that instead of running unique_tokens() again. Processor functions will be ignored if "tokens" is set. (Will need to make sure each choice is an object, even if just "choice = new String(choice)")

```js
query = fuzz.full_process("126-Abzx");
choices = [{id: 345, model: "123-abc"},
           {id: 346, model: "efg-123"},
           {id: 347, model: "456 abdzx"}];

for (choice of choices) {
        choice.tokens = fuzz.unique_tokens(fuzz.full_process(choice.model));
}
options = {
        scorer: fuzz.token_set_ratio,
        full_process: false
};
results = fuzz.extract(query, choices, options);
```

If using either "token_set" scorer as standalone functions: Tokenize both strings beforehand and attach them to options.tokens as a two element array.

```js
str1 = "fluffy head man";
str2 = "heady fluffy head";

str1_tokens = fuzz.unique_tokens(fuzz.full_process(str1));
str2_tokens = fuzz.unique_tokens(fuzz.full_process(str2));

options = {tokens: [str1_tokens, str2_tokens]};

// Still have to include first two args for validation but they won't be used for scoring
fuzz.token_set_ratio(str1, str2, options);
        85
```

Pass options to fuzz.unique_tokens as the second argument if you're using wildcards for it to be wildcard aware.


### Alternate Ratio Calculations


If you want to use difflib's ratio function for all ratio calculations, which differs slightly from the default python-Levenshtein style behavior, you can specify options.ratio_alg = "difflib". The difflib calculation is a bit different in that it's based on matching characters rather than true minimum edit distance, but the results are usually pretty similar. Difflib uses the formula 2.0*M / T  where M is the number of matches, and T is the total number of elements in both sequences. This mirrors the behavior of fuzzywuzzy when not using python-Levenshtein. Not all features (wildcards, collation) supported when using difflib ratio.

Except when using difflib, the ratios are calculated as ((str1.length + str2.length) - distance) / (str1.length + str2.length), where distance is calculated with a substitution cost of 2. This follows the behavior of python-Levenshtein, however the fuzz.distance function still uses a cost of 1 by default for all operations if just calculating distance and not a ratio.

Not all scoring options are available if using the difflib calculation. (i.e. useCollator, wildcards)

### Lite Bundles

Also available are the __fuzzball_lite__ and __fuzzball_ultra_lite__ bundles if you need a smaller file size. These are located at lite/fuzzball_lite.umd.min.js and ultra_lite/fuzzball_ultra_lite.umd.min.js. The full version has been reworked to only pull in the needed parts from difflib, so the difference between it and lite isn't quite as much as before.

The lite version doesn't include the partial ratio functions, and only has limited wildcard support. The ultra_lite version doesn't include those and further leaves support out proper for collation or astral symbols, the extract functions are not as optimized for large datasets, and it's alphanumeric check will strip out all non-ascii characters.

The full, lite and ultra_lite flavors currently weight in at a compressed 28kB, 20kB, and 8kB, respectively. Now using UMD format but the old browser bundles still provided.

### Credits

In addition to all dependencies..

Distance calculations based on [leven](https://github.com/sindresorhus/leven) and [fast-levenshtein](https://github.com/hiddentao/fast-levenshtein).

Default ratio formula is based on [python-Levenshtein](https://github.com/miohtama/python-Levenshtein).

Unicode alphanumerica check from [XRegExp](http://xregexp.com).

Substring matching from [difflib.js](https://github.com/qiao/difflib.js).

Inspiration to add cancellation and async optimization from [fuzzysort](https://github.com/farzher/fuzzysort)

Thanks to dvisg and voidevector on reddit for .d.ts feedback.

### Contributions

Pull requests welcome.
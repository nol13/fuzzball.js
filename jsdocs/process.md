<a name="dedupe"></a>

## dedupe(contains_dupes, [options_p]) ⇒ <code>Array.&lt;Object&gt;</code> \| <code>Array.&lt;Array&gt;</code>
This convenience function takes a list of strings containing duplicates and uses fuzzy matching to identify
and remove duplicates. Specifically, it uses extract to identify duplicates that
score greater than a user defined threshold/cutoff. Then, it looks for the longest item in the duplicate list
since we assume this item contains the most entity information and returns that. It breaks string
length ties on an alphabetical sort.

Note: as the threshold DECREASES the number of duplicates that are found INCREASES. This means that the
returned deduplicated list will likely be shorter. Raise the threshold for fuzzy_dedupe to be less
sensitive.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> \| <code>Array.&lt;Array&gt;</code> - - array of unique items and the index/key of the used match in contains_dupes.  

| Param | Type | Description |
| --- | --- | --- |
| contains_dupes | <code>Array.&lt;String&gt;</code> \| <code>Array.&lt;Object&gt;</code> \| <code>Object</code> | array of strings, or array of choice objects if processor is supplied, or object of form {key: choice} |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Whether to include map of matching items in results |
| [options_p.scorer] | <code>function</code> | takes two strings and returns a score |
| [options_p.processor] | <code>function</code> | takes each choice and outputs a string to be used for Scoring |
| [options_p.cutoff] | <code>number</code> | matching threshold 0-100, Default: 70 |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.astral] | <code>boolean</code> | use iLeven for scoring to properly handle astral symbols |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false |
| [options_p.trySimple] | <code>boolean</code> | try simple/partial ratio as part of (parial_)token_set_ratio test suite |
| [options_p.subcost] | <code>number</code> | Substitution cost, default 1 for distance, 2 for all ratios |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |
| [options_p.keepmap] | <code>boolean</code> | keep the items mapped to this value, default false |
| [options_p.returnObjects] | <code>boolean</code> | return array of object instead of array of tuples |


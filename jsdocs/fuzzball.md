[< back to README](https://github.com/nol13/fuzzball.js)

<a name="module_fuzzball"></a>

## fuzzball

* [fuzzball](#module_fuzzball)
    * [~distance(str1, str2, [options_p])](#module_fuzzball..distance) ⇒ <code>number</code>
    * [~ratio(str1, str2, [options_p])](#module_fuzzball..ratio) ⇒ <code>number</code>
    * [~partial_ratio(str1, str2, [options_p])](#module_fuzzball..partial_ratio) ⇒ <code>number</code>
    * [~token_set_ratio(str1, str2, [options_p])](#module_fuzzball..token_set_ratio) ⇒ <code>number</code>
    * [~partial_token_set_ratio(str1, str2, [options_p])](#module_fuzzball..partial_token_set_ratio) ⇒ <code>number</code>
    * [~token_sort_ratio(str1, str2, [options_p])](#module_fuzzball..token_sort_ratio) ⇒ <code>number</code>
    * [~partial_token_sort_ratio(str1, str2, [options_p])](#module_fuzzball..partial_token_sort_ratio) ⇒ <code>number</code>
    * [~WRatio(str1, str2, [options_p])](#module_fuzzball..WRatio) ⇒ <code>number</code>
    * [~extract(query, choices, [options_p])](#module_fuzzball..extract) ⇒ <code>Array.&lt;Array&gt;</code> \| <code>Array.&lt;Object&gt;</code>
    * [~extractAsync(query, choices, [options_p], callback)](#module_fuzzball..extractAsync)

<a name="module_fuzzball..distance"></a>

### fuzzball~distance(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate levenshtein distance of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein distance (0 and above).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..ratio"></a>

### fuzzball~ratio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate levenshtein ratio of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..partial_ratio"></a>

### fuzzball~partial\_ratio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate partial levenshtein ratio of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..token_set_ratio"></a>

### fuzzball~token\_set\_ratio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate token set ratio of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.trySimple] | <code>boolean</code> | try simple/partial ratio as part of (parial_)token_set_ratio test suite |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..partial_token_set_ratio"></a>

### fuzzball~partial\_token\_set\_ratio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate partial token ratio of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.trySimple] | <code>boolean</code> | try simple/partial ratio as part of (parial_)token_set_ratio test suite |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..token_sort_ratio"></a>

### fuzzball~token\_sort\_ratio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate token sort ratio of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..partial_token_sort_ratio"></a>

### fuzzball~partial\_token\_sort\_ratio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate partial token sort ratio of the two strings.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..WRatio"></a>

### fuzzball~WRatio(str1, str2, [options_p]) ⇒ <code>number</code>
Calculate weighted ratio of the two strings, taking best score of various methods.

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>number</code> - - the levenshtein ratio (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | the first string. |
| str2 | <code>string</code> | the second string. |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |

<a name="module_fuzzball..extract"></a>

### fuzzball~extract(query, choices, [options_p]) ⇒ <code>Array.&lt;Array&gt;</code> \| <code>Array.&lt;Object&gt;</code>
Return the top scoring items from an array (or assoc array) of choices

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  
**Returns**: <code>Array.&lt;Array&gt;</code> \| <code>Array.&lt;Object&gt;</code> - - array of choice results with their computed ratios (0-100).  

| Param | Type | Description |
| --- | --- | --- |
| query |  | the search term. |
| choices | <code>Array.&lt;String&gt;</code> \| <code>Array.&lt;Object&gt;</code> \| <code>Object</code> | array of strings, or array of choice objects if processor is supplied, or object of form {key: choice} |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.scorer] | <code>function</code> | takes two values and returns a score, will be passed options as 3rd argument |
| [options_p.processor] | <code>function</code> | takes each choice and outputs a value to be used for Scoring |
| [options_p.limit] | <code>number</code> | optional max number of results to return, returns all if not supplied |
| [options_p.cutoff] | <code>number</code> | minimum score that will get returned 0-100 |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.trySimple] | <code>boolean</code> | try simple/partial ratio as part of (parial_)token_set_ratio test suite |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.returnObjects] | <code>boolean</code> | return array of object instead of array of tuples; default false |

<a name="module_fuzzball..extractAsync"></a>

### fuzzball~extractAsync(query, choices, [options_p], callback)
Return the top scoring items from an array (or assoc array) of choices

**Kind**: inner method of [<code>fuzzball</code>](#module_fuzzball)  

| Param | Type | Description |
| --- | --- | --- |
| query |  | the search term. |
| choices | <code>Array.&lt;String&gt;</code> \| <code>Array.&lt;Object&gt;</code> \| <code>Object</code> | array of strings, or array of choice objects if processor is supplied, or object of form {key: choice} |
| [options_p] | <code>Object</code> | Additional options. |
| [options_p.scorer] | <code>function</code> | takes two values and returns a score, will be passed options as 3rd argument |
| [options_p.processor] | <code>function</code> | takes each choice and outputs a value to be used for Scoring |
| [options_p.limit] | <code>number</code> | optional max number of results to return, returns all if not supplied |
| [options_p.cutoff] | <code>number</code> | minimum score that will get returned 0-100 |
| [options_p.useCollator] | <code>boolean</code> | Use `Intl.Collator` for locale-sensitive string comparison. |
| [options_p.astral] | <code>number</code> | Use astral aware calculation |
| [options_p.normalize] | <code>string</code> | Normalize unicode representations |
| [options_p.full_process] | <code>boolean</code> | Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true |
| [options_p.force_ascii] | <code>boolean</code> | Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default false |
| [options_p.collapseWhitespace] | <code>boolean</code> | Collapse consecutive white space during full_process, default true |
| [options_p.trySimple] | <code>boolean</code> | try simple/partial ratio as part of (parial_)token_set_ratio test suite |
| [options_p.wildcards] | <code>string</code> | characters that will be used as wildcards if provided |
| [options_p.returnObjects] | <code>boolean</code> | return array of object instead of array of tuples; default false |
| [options_p.cancelToken] | <code>Object</code> | track cancellation |
| [options_p.asyncLoopOffset] | <code>number</code> | number of rows to run in between every async loop iteration, default 256 |
| callback | <code>function</code> | node style callback (err, arrayOfResults) |


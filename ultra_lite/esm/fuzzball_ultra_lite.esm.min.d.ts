export interface FuzzballBaseOptions {
    /**
     * Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
     */
    full_process?: boolean;
    /**
     * Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true
     */
    force_ascii?: boolean;
    /**
     * Collapse consecutive white space during full_process, default true
     */
    collapseWhitespace?: boolean;
    /**
     * Substitution cost, default 1 for distance, 2 for all ratios, prob don't want to change it
     */
    wildcards?: string;
    /**
     * Normalize unicode representations, default true when astral is true
     */
    normalize?: boolean;
}

export interface FuzzballTokenSetOptions extends FuzzballBaseOptions {
    /**
     * Include ratio as part of token set test suite
     */
    trySimple?: boolean;
}

interface FuzzballExtractBaseOptions extends FuzzballBaseOptions {
    /**
     * Include ratio as part of token set test suite
     */
    trySimple?: boolean;
    /**
     * Scoring function, default: ratio
     */
    scorer?: (str1: any, str2: any, opts?: FuzzballExtractOptions) => number;
    /**
     * Function that will be run on each choice (but not the query) before scoring
     */
    processor?: (str: any) => any;
    /**
     * Max number of results to return
     */
    limit?: number;
    /**
     * Lowest score to return, default 0
     */
    cutoff?: number;
}

interface AbortController {
    /**
     * If extract has been aborted;
     */
    signal: { aborted: boolean }
}

interface CancellationToken {
    /**
     * If extract has been canceled;
     */
    canceled?: boolean;
}

export interface FuzzballExtractOptions extends FuzzballExtractBaseOptions {
    /**
  * Return array of objects instead of tuples
  */
    returnObjects?: false;
}

export interface FuzzballExtractObjectOptions extends FuzzballExtractBaseOptions {
    /**
  * Return array of objects instead of tuples
  */
    returnObjects: true;
}

export interface FuzzballAsyncExtractOptions extends FuzzballExtractOptions {
    /**
     * Track if extract has been aborted
     */
    abortController?: AbortController;
    /**
     * Track if extract has been canceled
     */
    cancelToken?: CancellationToken;
    /**
     * Number of loop iterations between each async iteration
     */
    asyncLoopOffset?: number;
}

export interface FuzzballAsyncExtractObjectOptions extends FuzzballExtractObjectOptions {
    /**
     * Track if extract has been aborted
     */
    abortController?: AbortController;
    /**
     * Track if extract has been canceled;
     */
    cancelToken?: CancellationToken;
    /**
     * Number of loop iterations between each async iteration
     */
    asyncLoopOffset?: number;
}

export interface FuzzballDedupeOptions extends FuzzballExtractOptions {
    /**
     * Keep the items and scores mapped to this value, default false
     */
    keepmap?: false;
    /**
     * Function that will be run on each item before scoring
     */
    processor?: (str: any) => string;
}

export interface FuzzballDedupeOptionsWithMap extends FuzzballExtractOptions {
    /**
     * Keep the items and scores mapped to this value, default false
     */
    keepmap: true;
    /**
     * Function that will be run on each item before scoring
     */
    processor?: (str: any) => string;
}

export interface FuzzballDedupeObjOptions extends FuzzballExtractObjectOptions {
    /**
     * Keep the items and scores mapped to this value, default false
     */
    keepmap?: false;
    /**
     * Function that will be run on each item before scoring
     */
    processor?: (str: any) => string;
}

export interface FuzzballDedupeObjOptionsWithMap extends FuzzballExtractObjectOptions {
    /**
     * Keep the items and scores mapped to this value, default false
     */
    keepmap: true;
    /**
     * Function that will be run on each item before scoring
     */
    processor?: (str: any) => string;
}

export function distance(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function token_set_ratio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function token_sort_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function token_similarity_sort_ratio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function full_process(str: string, options?: FuzzballExtractOptions | boolean): string;
export function process_and_sort(str: string): string;
export function unique_tokens(str: string, opts?: FuzzballExtractOptions): string[];

export function extract(query: any, choices: any[], opts?: FuzzballExtractOptions): Array<[any, number, number]>;
export function extract(query: any, choices: Object, opts?: FuzzballExtractOptions): Array<[any, number, string]>;
export function extract(query: any, choices: any[], opts?: FuzzballExtractObjectOptions): Array<{choice: any, score: number, key: number}>;
export function extract(query: any, choices: Object, opts?: FuzzballExtractObjectOptions): Array<{ choice: any, score: number, key: string}>;

export function extractAsync(query: any, choices: any[], opts: FuzzballAsyncExtractOptions, callback: (err: any, results?: Array<[any, number, number]>) => void): void;
export function extractAsync(query: any, choices: Object, opts: FuzzballAsyncExtractOptions, callback: (err: any, results?: Array<[any, number, string]>) => void): void;
export function extractAsync(query: any, choices: any[], opts: FuzzballAsyncExtractObjectOptions, callback: (err: any, results?: Array<{ choice: any, score: number, key: number }>) => void): void;
export function extractAsync(query: any, choices: Object, opts: FuzzballAsyncExtractObjectOptions, callback: (err: any, results?: Array<{ choice: any, score: number, key: string }>) => void): void;

export function extractAsPromised(query: any, choices: any[], opts: FuzzballAsyncExtractOptions): Promise<Array<[any, number, number]>>;
export function extractAsPromised(query: any, choices: Object, opts: FuzzballAsyncExtractOptions): Promise<Array<[any, number, string]>>;
export function extractAsPromised(query: any, choices: any[], opts: FuzzballAsyncExtractObjectOptions): Promise<Array<{ choice: any, score: number, key: number }>>;
export function extractAsPromised(query: any, choices: Object, opts: FuzzballAsyncExtractObjectOptions): Promise<Array<{ choice: any, score: number, key: string }>>;

export function dedupe(contains_dupes: any[], opts?: FuzzballDedupeOptions): Array<[any, number]>;
export function dedupe(contains_dupes: Object, opts?: FuzzballDedupeOptions): Array<[any, string]>;
export function dedupe(contains_dupes: any[], opts?: FuzzballDedupeOptionsWithMap): Array<[any, number, Array<[any, number, number]>]>;
export function dedupe(contains_dupes: Object, opts?: FuzzballDedupeOptionsWithMap): Array<[any, string, Array<[any, number, string]>]>;

export function dedupe(contains_dupes: any[], opts?: FuzzballDedupeObjOptions): Array<{item: any, key: number}>;
export function dedupe(contains_dupes: Object, opts?: FuzzballDedupeObjOptions): Array<{ item: any, key: string }>;
export function dedupe(contains_dupes: any[], opts?: FuzzballDedupeObjOptionsWithMap): Array<{item: any, key: number, matches: Array<{ choice: any, score: number, key: number }>}>;
export function dedupe(contains_dupes: Object, opts?: FuzzballDedupeObjOptionsWithMap): Array<{item: any, key: string, matches: Array<{ choice: any, score: number, key: string }>}>;

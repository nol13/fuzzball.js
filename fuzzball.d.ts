export interface FuzzballBaseOptions {
    /**
     * Use Intl.Collator for locale-sensitive string comparison.
     */
    useCollator?: boolean;
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
     * Substitution cost, default 1 for distance, 2 for all ratios
     */
    subcost?: number;
    /**
     * String where each character it contains will be treated as a wildcard in distance calculations
     */
    wildcards?: string;
    /**
     * Use astral symbol and post-BMP codepoint aware distance calculation, default false
     */
    astral?: boolean;
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

export interface FuzzballExtractOptions extends FuzzballBaseOptions {
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

export interface FuzzballDedupeOptions extends FuzzballExtractOptions {
    /**
     * Keep the items and scores mapped to this value, default false
     */
    keepmap?: false
}

export interface FuzzballDedupeOptionsWithMap extends FuzzballExtractOptions {
    /**
     * Keep the items and scores mapped to this value, default false
     */
    keepmap: true
}

export function distance(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function partial_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function token_set_ratio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function token_sort_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function partial_token_set_ratio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function partial_token_sort_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function WRatio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function full_Process(str: string, options?: FuzzballExtractOptions | boolean): string;
export function process_and_sort(str: string): string;
export function unique_tokens(str: string, opts?: FuzzballExtractOptions): string[];

export function extract(query: any, choices: any[], opts?: FuzzballExtractOptions): Array<[any, number, number]>;
export function extract(query: any, choices: Object, opts?: FuzzballExtractOptions): Array<[any, number, string]>;
export function extractAsync(query: any, choices: any[], opts: FuzzballExtractOptions, callback: (err: any, results?: Array<[any, number, number]>) => void): void;
export function extractAsync(query: any, choices: Object, opts: FuzzballExtractOptions, callback: (err: any, results?: Array<[any, number, string]>) => void): void;

export function dedupe(contains_dupes: any[], opts?: FuzzballDedupeOptions): Array<[any, number]>;
export function dedupe(contains_dupes: Object, opts?: FuzzballDedupeOptions): Array<[any, string]>;
export function dedupe(contains_dupes: any[], opts?: FuzzballDedupeOptionsWithMap): Array<[any, number, Array<[any, number, number]>]>;
export function dedupe(contains_dupes: Object, opts?: FuzzballDedupeOptionsWithMap): Array<[any, string, Array<[any, number, string]>]>;

export as namespace fuzzball;
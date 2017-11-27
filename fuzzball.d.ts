// Type definitions for fuzzball.js
// Project: https://github.com/nol13/fuzzball.js
export interface FuzzballOptions {
    useCollator?: boolean;
    full_process?: boolean;
    force_ascii?: boolean;
    collapseWhitespace?: boolean;
    subcost?: number;
    wildcards?: string;
    astral?: boolean;
    normalize?: boolean;
    trySimple?: boolean;
}

export interface FuzzballResults {
    [index: number]: [Any, number, string | number];
}

export interface DedupeResults {
    [index: number]: [Any, number | string, FuzzballResults?];
}

export function distance(str1: string, str2: string, opts?: FuzzballOptions): number;
export function ratio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function partial_ratio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function token_set_ratio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function token_sort_ratio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function partial_token_set_ratio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function partial_token_sort_ratio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function WRatio(str1: string, str2: string, opts?: FuzzballOptions): number;
export function extract(query: string, choices: Any, opts?: Any): FuzzballResults;
export function extractAsync(query: string, choices: Any, opts?: EAny, callback: (err: Any, results?: FuzzballResults) => void): void;
export function full_Process(str: Any, options?: FuzzballOptions | boolean): string;
export function process_and_sort(str: Any): string;
export function unique_tokens(str: string, opts?: FuzzballOptions): string[];
export function dedupe(contains_dupes: Any, opts?: Any): DedupeResults;
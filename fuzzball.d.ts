export interface FuzzballBaseOptions {
    useCollator?: boolean;
    full_process?: boolean;
    force_ascii?: boolean;
    collapseWhitespace?: boolean;
    subcost?: number;
    wildcards?: string;
    astral?: boolean;
    normalize?: boolean;
}

export interface FuzzballTokenSetOptions extends FuzzballBaseOptions {
    trySimple?: boolean;
}

export interface FuzzballExtractOptions extends FuzzballBaseOptions {
    trySimple?: boolean;
    scorer?: (str1: any, str2: any, opts?: FuzzballExtractOptions) => number;
    processor?: (str: any) => any;
    limit?: number;
    cutoff?: number;
}

export interface ExtractResults {
    [index: number]: [any, number, string | number];
}

export interface DedupeResults {
    [index: number]: [any, number | string, ExtractResults] | [any, number | string];
}

export function distance(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function partial_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function token_set_ratio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function token_sort_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function partial_token_set_ratio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function partial_token_sort_ratio(str1: string, str2: string, opts?: FuzzballBaseOptions): number;
export function WRatio(str1: string, str2: string, opts?: FuzzballTokenSetOptions): number;
export function extract(query: any, choices: any, opts?: FuzzballExtractOptions): ExtractResults;
export function extractAsync(query: any, choices: any, opts?: FuzzballExtractOptions, callback?: (err: any, results?: ExtractResults) => void): void;
export function full_Process(str: string, options?: FuzzballExtractOptions | boolean): string;
export function process_and_sort(str: string): string;
export function unique_tokens(str: string, opts?: FuzzballExtractOptions): string[];
export function dedupe(contains_dupes: any, opts?: FuzzballExtractOptions): DedupeResults;

export as namespace fuzzball;
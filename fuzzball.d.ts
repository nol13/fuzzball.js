export interface ExtractResults {
    [index: number]: [Any, number, string | number];
}

export interface DedupeResults {
    [index: number]: [Any, number | string, ExtractResults?];
}

export function distance(str1: string, str2: string, opts?: Any): number;
export function ratio(str1: string, str2: string, opts?: Any): number;
export function partial_ratio(str1: string, str2: string, opts?: Any): number;
export function token_set_ratio(str1: string, str2: string, opts?: Any): number;
export function token_sort_ratio(str1: string, str2: string, opts?: Any): number;
export function partial_token_set_ratio(str1: string, str2: string, opts?: Any): number;
export function partial_token_sort_ratio(str1: string, str2: string, opts?: Any): number;
export function WRatio(str1: string, str2: string, opts?: Any): number;
export function extract(query: string, choices: Any, opts?: Any): ExtractResults;
export function extractAsync(query: string, choices: Any, opts?: Any, callback: (err: Any, results?: ExtractResults) => void): void;
export function full_Process(str: Any, options?: Any | boolean): string;
export function process_and_sort(str: Any): string;
export function unique_tokens(str: string, opts?: Any): string[];
export function dedupe(contains_dupes: Any, opts?: Any): DedupeResults;
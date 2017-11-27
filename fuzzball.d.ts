export interface ExtractResults {
    [index: number]: [any, number, string | number];
}

export interface DedupeResults {
    [index: number]: [any, number | string, ExtractResults] | [any, number | string];
}

export function distance(str1: string, str2: string, opts?: any): number;
export function ratio(str1: string, str2: string, opts?: any): number;
export function partial_ratio(str1: string, str2: string, opts?: any): number;
export function token_set_ratio(str1: string, str2: string, opts?: any): number;
export function token_sort_ratio(str1: string, str2: string, opts?: any): number;
export function partial_token_set_ratio(str1: string, str2: string, opts?: any): number;
export function partial_token_sort_ratio(str1: string, str2: string, opts?: any): number;
export function WRatio(str1: string, str2: string, opts?: any): number;
export function extract(query: string, choices: any, opts?: any): ExtractResults;
export function extractAsync(query: string, choices: any, opts?: any, callback?: (err: any, results?: ExtractResults) => void): void;
export function full_Process(str: any, options?: any | boolean): string;
export function process_and_sort(str: any): string;
export function unique_tokens(str: string, opts?: any): string[];
export function dedupe(contains_dupes: any, opts?: any): DedupeResults;

export as namespace fuzzball;
import * as types from './types';

export function filterTable(filter) {
    return {
        type: types.FILTER,
        filter
    };
}

export function checkFullProcess(fullProcVal) {
    return {
        type: types.FULLPROCESS,
        fullProcVal
    };
}

export function enterWildcards(wildcards) {
    return {
        type: types.WILDCARDS,
        wildcards
    };
}

export function selectDataset(dataset) {
    return {
        type: types.DATASET,
        dataset
    };
}

export function enterData(data) {
    return {
        type: types.ENTERED_DATASET,
        data
    };
}

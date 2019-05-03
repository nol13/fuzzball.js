import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const filter = (state = '', action) => {
    switch (action.type) {
        case types.FILTER:
            return action.filter;
        default:
            return state;
    }
};

const fullProcess = (state = true, action) => {
    switch (action.type) {
        case types.FULLPROCESS:
            return action.fullProcVal;
        default:
            return state;
    }
};

const wildcards = (state = '', action) => {
    switch (action.type) {
        case types.WILDCARDS:
            return action.wildcards;
        default:
            return state;
    }
};

const dataset = (state = 'trees', action) => {
    switch (action.type) {
        case types.DATASET:
            return action.dataset;
        default:
            return state;
    }
};

const enteredData = (state = [], action) => {
    switch (action.type) {
        case types.ENTERED_DATASET:
            return action.data;
        default:
            return state;
    }
};


const rootReducer = combineReducers({
    filter,
    fullProcess,
    wildcards,
    dataset,
    routing,
    enteredData
});

export default rootReducer;

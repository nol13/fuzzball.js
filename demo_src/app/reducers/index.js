import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const filter = (state = '542222CC', action) => {
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

const wildcards = (state = 'x', action) => {
    switch (action.type) {
        case types.WILDCARDS:
            return action.wildcards;
        default:
            return state;
    }
};

const dataset = (state = 'dlc', action) => {
    switch (action.type) {
        case types.DATASET:
            return action.dataset;
        default:
            return state;
    }
};


const rootReducer = combineReducers({
    filter,
    fullProcess,
    wildcards,
    dataset,
    routing
});

export default rootReducer;

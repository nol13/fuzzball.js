import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { filterTable, checkFullProcess, enterWildcards, selectDataset } from '../actions';
import ProductTable from '../components/ProductTable';
import { filterableTable, clear } from '../styles/filterableTable.scss';

const FilterableTable = ({ filter, onFilter, fullProcVal, onFullProcCheck, wildcards, onWildcard, dataset, onDataset }) => {
    let input;
    let input2;
    let input3;
    let input4;
    // alert(filter);

    return (
        <div className={filterableTable}>
            <label>
               Select dataset:
                <select ref={node => { input4 = node; }} value={dataset}
                    onChange={() => onDataset(input4.value)}>
                    <option value="dlc">DLC Model Numbers</option>
                    <option value="bengals">Bengals Players</option>
                </select>
            </label>&nbsp;&nbsp;
            Query: <input
                value={filter}
                ref={node => { input = node; }}
                onChange={() => onFilter(input.value)} />
            &nbsp;&nbsp; Full Process? <input type="checkbox" defaultChecked value={fullProcVal} ref={node => { input2 = node; }} onChange={() => onFullProcCheck(input2.checked)} />
            &nbsp;&nbsp; Wildcards:
            <input
                value={wildcards}
                ref={node => { input3 = node; }}
                onChange={() => onWildcard(input3.value)} />
            <div>
                <ProductTable filter={filter} scorer="ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={dataset} />
                <ProductTable filter={filter} scorer="partial_ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={dataset} />
                <ProductTable filter={filter} scorer="token_sort_ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={dataset} />
                <ProductTable filter={filter} scorer="token_set_ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={dataset} />
            </div>
            <div className={clear} />
        </div>
    );
};

FilterableTable.propTypes = {
    filter: PropTypes.string,
    onFilter: PropTypes.func,
    fullProcVal: PropTypes.bool,
    onFullProcCheck: PropTypes.func,
    wildcards: PropTypes.string,
    onWildcard: PropTypes.func,
    dataset: PropTypes.string,
    onDataset: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        filter: state.filter,
        fullProcVal: state.fullProcess,
        wildcards: state.wildcards,
        dataset: state.dataset
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onFilter: filterText => dispatch(filterTable(filterText)),
        onFullProcCheck: fullProcVal => dispatch(checkFullProcess(fullProcVal)),
        onWildcard: wildcards => dispatch(enterWildcards(wildcards)),
        onDataset: dataset => dispatch(selectDataset(dataset))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterableTable);

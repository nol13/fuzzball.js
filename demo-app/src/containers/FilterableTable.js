import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { filterTable, checkFullProcess, enterWildcards, selectDataset } from '../actions';
import ProductTable from '../components/ProductTable';
import { filterableTable, clear } from '../styles/filterableTable.module.scss';
import { Link } from 'react-router';

class FilterableTable extends PureComponent {

    handleDataSetChange = (value) => {
        const {onFilter, onDataset, onWildcard} = this.props;
        onFilter('');
        onDataset(value);
        onWildcard('');
    };

    render() {
        const { filter, onFilter, fullProcVal, onFullProcCheck, wildcards, onWildcard, dataset, enteredData } = this.props;
        let input;
        let input2;
        let input3;
        let input4;
        // alert(filter);

        const dlc = [
            { name: 'DEP-CLW-150WA1 4500K' },
            { name: '542222XX' },
            { name: '542222XX 4500K 542222xx-BL' },
            { name: 'DEP-HB02-100WD1 5000K' },
            { name: 'YR-PL345-W150-X-Y6-P(3500K)' },
            { name: 'PL01-36DS286-S403Y-50' },
            { name: 'LID2240W' },
            { name: 'LID2240W LID2240W/B LID2240W/W' }
        ];

        const bengals = [
            { name: 'Brown, Chris' },
            { name: 'Ryan Brown' },
            { name: 'Dawson, P.J.' },
            { name: 'Green, A.J.' },
            { name: 'Green, AJ' },
            { name: 'AJ Green' },
            { name: 'Willis, Jordan' },
            { name: 'Atkins, Geno' },
            { name: 'Chad Ochocinco' },
            { name: 'Geno, Geno Atkins' },
            { name: 'Geno Atkins' }
        ];

        const trees = [
            { name: 'American Elm' },
            { name: 'Slippery Elm' },
            { name: 'Balsam Fir' },
            { name: 'Northern Red Oak' },
            { name: 'American Chestnut' },
            { name: 'Scarlet Oak' },
            { name: 'Red Spruce' },
            { name: 'Black Walnut' },
            { name: 'Black Willow' },
            { name: 'Red Pine' },
            { name: 'Pine, Red' },
            { name: 'Spruce - Red Spruce' },
            { name: 'Sycamore' },
            { name: 'Oak - Black Oak' },
        ];

        const datasets = { trees, dlc, bengals, custom: enteredData };

        return (
            <div className={filterableTable}>
                <Link to="/enter-data"><b>Enter Custom Dataset</b></Link><br /><br />
                <label>
                    Select dataset:&nbsp;
                <select ref={node => { input4 = node; }} value={dataset}
                        onChange={() => this.handleDataSetChange(input4.value)}>
                        <option value="trees">Trees</option>
                        <option value="bengals">Bengals Players</option>
                        <option value="dlc">DLC Model Numbers</option>
                        {enteredData.length ? <option value="custom">Custom Dataset</option> :
                            <option disabled value="custom">No custom choices have been entered</option>
                        }
                    </select>
                </label>&nbsp;&nbsp;
            Search Term: <input
                    value={filter}
                    ref={node => { input = node; }}
                    onChange={() => onFilter(input.value)} />
                &nbsp;&nbsp; Full Process? <input type="checkbox" defaultChecked value={fullProcVal} ref={node => { input2 = node; }} onChange={() => onFullProcCheck(input2.checked)} />
                &nbsp;&nbsp; Wildcards:&nbsp;
            <input
                    value={wildcards}
                    ref={node => { input3 = node; }}
                    onChange={() => onWildcard(input3.value)} />
                <div>
                    <ProductTable filter={filter} scorer="ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={datasets[dataset]} />
                    <ProductTable filter={filter} scorer="partial_ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={datasets[dataset]} />
                    <ProductTable filter={filter} scorer="token_sort_ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={datasets[dataset]} />
                    <ProductTable filter={filter} scorer="token_set_ratio" fullProcess={fullProcVal} wildcards={wildcards} dataset={datasets[dataset]} />
                </div>
                <div className={clear} />
            </div>
        );
    }
}

FilterableTable.propTypes = {
    filter: PropTypes.string,
    onFilter: PropTypes.func,
    fullProcVal: PropTypes.bool,
    onFullProcCheck: PropTypes.func,
    wildcards: PropTypes.string,
    onWildcard: PropTypes.func,
    dataset: PropTypes.string,
    onDataset: PropTypes.func,
    enteredData: PropTypes.array
};

const mapStateToProps = (state) => {
    return {
        filter: state.filter,
        fullProcVal: state.fullProcess,
        wildcards: state.wildcards,
        dataset: state.dataset,
        enteredData: state.enteredData || []
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { enterData, selectDataset, filterTable, enterWildcards } from '../actions';
import styles from '../styles/enterData.module.scss';

const { backToDemo, enterContainer, dataInput, linkButton } = styles;

class EnterData extends Component {
    constructor(props) {
        super(props);
        const text = this.props.enteredData.map(item => item.name || '').join('\n');
        this.state = {text: text};
    }

    handleChange = (e) => {
        this.setState({text: e.target.value});
    }

    handleSave = () => {
        const { onData, onDataset, onFilter, onWildcard, dataset } = this.props;
        const newData = this.state.text.split('\n').map(item => ({name: item.trim()})).filter(item => item.name);
        onData(newData);
        if (dataset !== 'custom') {
            onDataset('custom');
            onFilter('');
            onWildcard('');
        }
        this.context.router.push('/');
    }

    render() {
        return (<div>
        <div className={backToDemo}>
            <button className={linkButton} onClick={() => this.context.router.push('/')}> {"< cancel / back to demo"} </button>
        </div>
        <div className={enterContainer}>
            <p className={styles.customDataText}>Enter custom search terms below, one term per line.</p>
            <textarea className={dataInput} value={this.state.text} onChange={this.handleChange} />
            <br /><br />
            <input type="button" onClick={this.handleSave} value="Save" disabled={!this.state.text.trim()} />&nbsp;
            <input type="button" onClick={() => this.context.router.push('/')} value="Cancel" />
        </div>
        </div>);
    }
}

EnterData.contextTypes = {
    router: PropTypes.object
};

EnterData.propTypes = {
    enteredData: PropTypes.array,
    onData: PropTypes.func,
    onDataset: PropTypes.func,
    onFilter: PropTypes.func,
    onWildcard: PropTypes.func,
    dataset: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        enteredData: state.enteredData || [],
        dataset: state.dataset || 'dlc'
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onData: data => dispatch(enterData(data)),
        onDataset: dataset => dispatch(selectDataset(dataset)),
        onFilter: filterText => dispatch(filterTable(filterText)),
        onWildcard: wildcards => dispatch(enterWildcards(wildcards))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EnterData);

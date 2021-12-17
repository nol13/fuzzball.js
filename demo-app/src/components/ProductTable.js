import React from 'react';
import PropTypes from 'prop-types';
import ProductRow from './ProductRow';
import styles from '../styles/productTable.module.scss';
import * as fuzz from 'fuzzball';

class ProductTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { scoredProds: [] };
    }

    componentWillMount() {
        this.extract(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.extract(nextProps);
    }

    extract = (props) => {
        if (this.cancelToken) this.cancelToken.canceled = true;
        this.cancelToken = {canceled: false};
        let { filter, scorer, fullProcess, wildcards, dataset, sortBySimilarity} = props;
        if (sortBySimilarity && scorer === "token_sort_ratio") {
            scorer = "token_similarity_sort_ratio"
        }
        const options = {
            scorer: fuzz[scorer],
            processor: (choice) => { return choice.name; },
            full_process: fullProcess,
            wildcards,
            cancelToken: this.cancelToken,
            sortBySimilarity
        };
        const choices = dataset;
        fuzz.extractAsPromised(filter, choices, options).then(scoredProds => {
            this.setState({scoredProds});
        }).catch(() => {
            // canceled
        });
    };

    render() {
        let { scorer, sortBySimilarity } = this.props;
        if (sortBySimilarity && scorer === "token_sort_ratio") {
            scorer = "token_similarity_sort_ratio"
        }
        const { scoredProds } = this.state;
        let rows = [];
        scoredProds.forEach((p, i) => {
            rows.push(
                <ProductRow key={p[0].name + '-@-' + i} data={p} />
            );
        });
        return (<div className={styles.productTable}>
            <p className={styles.scorer}>{`${scorer}${sortBySimilarity && scorer === "token_set_ratio" ? ' {sortBySimilarity: true}' : ''}`}</p>
            {rows}
        </div>);
    }
}

ProductTable.propTypes = {
    filter: PropTypes.string,
    scorer: PropTypes.string,
    fullProcess: PropTypes.bool,
    sortBySimilarity: PropTypes.bool,
    wildcards: PropTypes.string,
    dataset: PropTypes.array
};

export default ProductTable;

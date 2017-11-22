import React, { PropTypes } from 'react';
import ProductRow from './ProductRow';
import { productTable, scorer as scorerStyle } from '../styles/productTable.scss';
import * as fuzz from 'fuzzball';
import debounce from 'lodash/debounce';


class ProductTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { scoredProds: [] };
    }

    componentWillMount() {
        this.extractDebounced(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.extractDebounced(nextProps);
    }

    extractDebounced = debounce((props) => {
        const { filter, scorer, fullProcess, wildcards, dataset } = props;
        const options = {
            scorer: fuzz[scorer],
            processor: (choice) => { return choice.name; },
            full_process: fullProcess,
            wildcards
        };
        const choices = dataset;
        const scoredProds = fuzz.extract(filter, choices, options);
        this.setState({scoredProds});
    }, 269, { leading: true });

    render() {
        const { scorer } = this.props;
        const { scoredProds } = this.state;
        let rows = [];
        //const scoredProds = extractDebounced(filter, choices, options);
        scoredProds.forEach((p) => {
            rows.push(
                <ProductRow key={p[0].name} data={p} />
            );
        });
        return (<div className={productTable}>
            <p className={scorerStyle}>{scorer}</p>
            {rows}
        </div>);
    }
}

ProductTable.propTypes = {
    filter: PropTypes.string,
    scorer: PropTypes.string,
    fullProcess: PropTypes.bool,
    wildcards: PropTypes.string,
    dataset: PropTypes.array
};

export default ProductTable;

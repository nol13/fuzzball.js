import React, { PropTypes } from 'react';
import ProductRow from './ProductRow';
import { productTable, scorer as scorerStyle } from '../styles/productTable.scss';
import * as fuzz from 'fuzzball';


const ProductTable = ({ filter, scorer, fullProcess, wildcards, dataset }) => {
    let rows = [];
    const options = { scorer: fuzz[scorer], processor: (choice) => { return choice.name; }, full_process: fullProcess };
    options.wildcards = wildcards;
    const choices = dataset;
    const scoredProds = fuzz.extract(filter, choices, options);
    scoredProds.forEach((p) => {
        rows.push(
            <ProductRow key={p[0].name} data={p} />
        );
    });

    return (<div className={productTable}>
    <p className={scorerStyle}>{scorer}</p>
    {rows}
    </div>);
};

ProductTable.propTypes = {
    filter: PropTypes.string,
    scorer: PropTypes.string,
    fullProcess: PropTypes.bool,
    wildcards: PropTypes.string,
    dataset: PropTypes.array
};

export default ProductTable;

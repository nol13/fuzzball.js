import React, { PropTypes } from 'react';
import ProductRow from './ProductRow';
import { productTable, scorer as scorerStyle } from '../styles/productTable.scss';
import * as fuzz from 'fuzzball';

const products = [
    { name: 'DEP-CLW-150WA1 4500K' },
    { name: '542222XX' },
    { name: '542222XX 4500K 542222XX-BL' },
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
    { name: 'Atkins, Geno Geno' }
];

const ProductTable = ({ filter, scorer, fullProcess, wildcards, dataset }) => {
    let rows = [];
    const options = { scorer: fuzz[scorer], processor: (choice) => { return choice.name; }, full_process: fullProcess };
    options.wildcards = wildcards;
    const choices = dataset === 'dlc' ? products : bengals;
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
    dataset: PropTypes.string
};

export default ProductTable;

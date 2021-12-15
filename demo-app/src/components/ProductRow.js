import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/productRow.module.scss';

const { prodrow } = styles;

const ProductRow = ({ data }) =>
    <div>
        <p className={prodrow}>{data[0].name}, Score: {data[1]} </p>
    </div>;

ProductRow.propTypes = {
    data: PropTypes.array
};

export default ProductRow;

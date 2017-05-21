import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { footer } from '../styles/footer.scss';

const App = ({ children }) =>
    <div>
        <h1>Fuzzball Scorer Demo</h1>
        { children }
        <footer className={footer}>
            <Link to="/">Fuzzball Demo</Link>
            <Link to="/about">About</Link>
        </footer>
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

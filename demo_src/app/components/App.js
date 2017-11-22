import React, { PropTypes } from 'react';
//import { Link } from 'react-router';
import { footer } from '../styles/footer.scss';

const App = ({ children }) =>
    <div style={{fontFamily: 'arial', fontSize: '13px'}}>
        <h2>Fuzzball.js Scorer Demo</h2>
        <a href="https://github.com/nol13/fuzzball.js">&lt; back to README </a><br /><br />
        { children }
        <footer className={footer}>
            <div style={{fontSize: 'smaller'}}>
                Demo based on boilerplate from <a href="https://github.com/jpsierens/webpack-react-redux">https://github.com/jpsierens/webpack-react-redux</a>
            </div>
        </footer>
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

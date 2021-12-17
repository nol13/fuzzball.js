import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/footer.module.scss';
import appStyles from "../styles/app.module.scss";
import logo from '../images/fuzzballlogo2alpha.png';

const App = ({ children }) =>
    <div className={appStyles.container}>
        <div className={appStyles.bg}/>
        <div className={appStyles.readmeLink}>
            <a href="https://github.com/nol13/fuzzball.js">&lt; back to README </a>
        </div>
        <img src={logo} alt="Fuzzball's Sweet 2nd Logo" className={appStyles.logo} />
        <h3 className={appStyles.header}>Scorer Demo</h3>
            { children }
        <footer className={styles.footerContainer}>
            <div className={styles.inner}>
                Demo based on boilerplate from <a href="https://github.com/jpsierens/webpack-react-redux">https://github.com/jpsierens/webpack-react-redux</a>and Create React App
            </div>
        </footer>
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

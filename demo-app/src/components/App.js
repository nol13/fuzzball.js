import React, { PropTypes } from 'react';
//import { Link } from 'react-router';
import { footerContainer, lol } from '../styles/footer.module.scss';
import logo from '../images/fuzzballlogo2alpha.png';

const App = ({ children }) =>
    <div style={{
        fontFamily: 'arial',
        fontSize: '13px',
        padding: '10px'
        }}
    >
        <div style={{
            backgroundColor: '#222222',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '-1',
        }}/>

        <div className={lol}>
            <a href="https://github.com/nol13/fuzzball.js">&lt; back to README </a>
        </div>

        <img src={logo} alt="Fuzzball's Sweet 2nd Logo" style={{
            height: '50px',
            display: 'inline',
            marginTop: '10px'
            }} 
        />
       
       
        <h3 style={{color: 'whitesmoke'}}>Scorer Demo</h3>
            { children }
        <footer className={footerContainer}>
            <div style={{fontSize: 'smaller'}}>
                Demo based on boilerplate from <a href="https://github.com/jpsierens/webpack-react-redux">https://github.com/jpsierens/webpack-react-redux</a>and Create React App
            </div>
        </footer>
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

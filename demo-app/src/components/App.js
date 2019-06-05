import React, { PropTypes } from 'react';
//import { Link } from 'react-router';
import { footer } from '../styles/footer.module.scss';
import logo from '../images/fuzzballlogo2alpha.png';

const App = ({ children }) =>
    <div style={{fontFamily: 'arial', fontSize: '13px', backgroundColor: 'black', padding: '12px', borderRadius: '10px', minHeight: '95vh'}}>

     <div className='lol'>
        <a href="https://github.com/nol13/fuzzball.js">&lt; back to README </a>
        </div>

        <img src={logo} alt="Fuzzball's Sweet 2nd Logo" style={{height: '80px', display: 'inline', marginTop: '3px'}} />
       
       
        <h3 style={{color: 'whitesmoke'}}>Scorer Demo</h3>
       
        <div style={{backgroundColor: 'black', padding: '2px'}}>
            { children }
        </div>
        
        <footer className={footer}>
            <div style={{fontSize: 'smaller'}}>
                Demo based on boilerplate from <a href="https://github.com/jpsierens/webpack-react-redux">https://github.com/jpsierens/webpack-react-redux</a>and Create React App
            </div>
        </footer>
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

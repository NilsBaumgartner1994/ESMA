import 'react-app-polyfill/ie9';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ScrollToTop from './showcase/scrolltotop/ScrollToTop';
import { BrowserRouter as Router } from 'react-router-dom';
import config from './config';

document.title = config.title;

ReactDOM.render(
    <Router>
        <ScrollToTop>
            <App></App>
        </ScrollToTop>
    </Router>,
    document.getElementById('root')
);
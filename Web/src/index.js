import 'react-app-polyfill/ie9';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ScrollToTop from './showcase/scrolltotop/ScrollToTop';
import {HashRouter} from 'react-router-dom';
import config from './config';

document.title = config.title;

ReactDOM.render(
    <HashRouter>
        <ScrollToTop>
            <App></App>
        </ScrollToTop>
    </HashRouter>,
    document.getElementById('root')
);
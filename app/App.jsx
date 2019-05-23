
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,  } from 'react-router-dom';
import { browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux';
import store from './store';

import initTranslation from './components/Common/localize';
import initLoadThemes from './components/Common/load-themes';

import Routes from './Routes';

import './styles/bootstrap.scss';
import './styles/app.scss'

initTranslation();
initLoadThemes();

// Disable warning "Synchronous XMLHttpRequest on the main thread is deprecated.."
// $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
//     options.async = true;
// });
ReactDOM.render((

    <Provider store={store}>
    <BrowserRouter basename={WP_BASE_HREF}>
        <Routes />
    </BrowserRouter>
    </Provider>
), document.getElementById('app'))

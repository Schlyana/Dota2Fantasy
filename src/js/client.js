import React from 'react';
var ReactDOM = require('react-dom');
var {Router, Route} = require('react-router');

/* Components */
var Layout = require('./components/Layout');
var SignIn = require('./components/SignIn');

const app = document.getElementById('app');

ReactDOM.render(
    <Router>
        <Route path="/" component={Layout}></Route>
    </Router>,
    app);

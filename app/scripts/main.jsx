"use strict";

var path = require('path');
var React = require('react');
var App = require('./components/app.jsx');

// needed for dev tools to work
window.React = React;

React.render(<App/>, document.getElementById('content-main'));


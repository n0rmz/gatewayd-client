"use strict";

if (!window.Intl) {
  window.Intl = require('intl');
}

var path = require('path');
var React = require('react');
var App = require('./components/app.jsx');
var stringLib = require('../i18n/messages');

// needed for dev tools to work
window.React = React;

React.render(<App {...stringLib} locales={['en-US']} />,
  document.getElementById('content-main'));

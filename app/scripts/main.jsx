'use strict';

if (!window.Intl) {
  window.Intl = require('intl');
}

var path = require('path');
var React = require('react');
var Router = require('react-router');
var appRoutes = require('scripts/components/appRouter.jsx');


// needed for dev tools to work
window.React = React;

Router.run(appRoutes, Handler => {
  React.render(<Handler />,
    document.getElementById('content-main'));
});

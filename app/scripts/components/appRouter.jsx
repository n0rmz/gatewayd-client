'use strict';

var React = require('react');
var Router = require('react-router');
var {Route, Redirect, RouteHandler, Link} = Router;

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var AppStringLib = require('./i18n/app-messages');
var QuotingStringLib = require('scripts/apps/quoting/i18n/quoting-messages');
var ManualIntegrationStringLib = require('scripts/apps/manual-integration/i18n/manual-integration-messages');
var RippleStringLib = require('scripts/apps/ripple/i18n/ripple-messages');

var App = require('./app.jsx');
var QuotingApp = require('scripts/apps/quoting/app.jsx');
var ManualIntegrationTransactionsApp = require('scripts/apps/manual-integration/transactions-app.jsx');
var ManualIntegrationAccountsApp = require('scripts/apps/manual-integration/accounts-app.jsx');
var RippleApp = require('scripts/apps/ripple/app.jsx');

var AppWrapper = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <App {...AppStringLib} locales={['en-US']} />
    );
  }
});

var QuotingAppWrapper = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <QuotingApp {...QuotingStringLib} locales={['en-US']} />
    );
  }
});

var ManualIntegrationTransactionsAppWrapper = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <ManualIntegrationTransactionsApp {...ManualIntegrationStringLib} locales={['en-US']} />
    );
  }
});

var ManualIntegrationAccountsAppWrapper = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <ManualIntegrationAccountsApp {...ManualIntegrationStringLib} locales={['en-US']} />
    );
  }
});

var RippleAppWrapper = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <RippleApp {...RippleStringLib} locales={['en-US']} />
    );
  }
});

var appRoutes = (
  <Route path='/' handler={AppWrapper}>
    <Route name='get-quote' path='get-quote' handler={QuotingAppWrapper} />
    <Route
      name='ripple-transactions'
      path='ripple-transactions/:direction/:state'
      handler={RippleAppWrapper}
    />
    <Route
      name='external-transactions'
      path='external-transactions/:transactionType/:state'
      handler={ManualIntegrationTransactionsAppWrapper}
    />
    <Route
      name='external-accounts'
      path='external-accounts/:accountType'
      handler={ManualIntegrationAccountsAppWrapper}
    />
    <Redirect from='/' to='get-quote' />
    <Redirect
      from='external-transactions'
      to='external-transactions'
      params={{transactionType: 'withdrawals', state: 'all'}}
    />
    <Redirect
      from='external-accounts'
      to='external-accounts'
      params={{accountType: 'all'}}
    />
    <Redirect
      from='ripple-transactions'
      to='ripple-transactions'
      params={{direction: 'outgoing', state: 'all'}}
    />
  </Route>
);

module.exports = appRoutes;

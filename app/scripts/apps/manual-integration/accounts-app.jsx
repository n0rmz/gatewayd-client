'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Router = require('react-router');
var {Route, Redirect, RouteHandler, Link} = Router;
var ExternalAccounts = require('./modules/external-accounts/components/accounts.jsx');
var DocumentTitle = require('react-document-title');

// required to use React Bootstrap in child modules
require('react-bootstrap');

var RippleApp =
  React.createClass({

    mixins: [IntlMixin],

    render: function(){
      return (
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12 col-md-12 main'>
              <ExternalAccounts/>
            </div>
          </div>
        </div>
      )
    }
});

module.exports = RippleApp;

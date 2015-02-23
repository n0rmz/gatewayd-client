'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Router = require('react-router');
var {Route, Redirect, RouteHandler, Link} = Router;

var DocumentTitle = require('react-document-title');
var BridgeQuote = require('./modules/bridge-quote-flow/components/bridge-quote-flow.jsx');

// required to use React Bootstrap in child modules
require('react-bootstrap');

var QuotingApp =
  React.createClass({

    mixins: [IntlMixin],

    render: function(){
      return (
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12 col-md-12 main'>
              <BridgeQuote/>
            </div>
          </div>
        </div>
      )
    }
});

module.exports = QuotingApp;

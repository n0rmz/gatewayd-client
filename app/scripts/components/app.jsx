'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var React = require('react');
var Morearty = require('morearty');

var DocumentTitle = require('react-document-title');
var BridgeQuote = require('./bridge-quote-flow.jsx');

var TopBar = require('../shared/components/header/top-bar.jsx');

// required to use React Bootstrap in child modules
require('react-bootstrap');

var capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var topBarConfig = {
  brandName: capitalize(location.hostname) + ' | Customer Funds Transfer',
  wrapperClassName: 'navbar-inverse navbar-fixed-top top-bar container-fluid'
};

var App =
  React.createClass({

    mixins: [IntlMixin, Morearty.Mixin],

    render:function(){
      var binding = this.getBinding();

      return (
        <div>
          <TopBar
            brandName={topBarConfig.brandName}
            wrapperClassName={topBarConfig.wrapperClassName}
          />
          <div className='container'>
            <div className='row'>
              <div className='col-sm-12 col-md-12 main'>
                <DocumentTitle title={topBarConfig.brandName}>
                  <BridgeQuote binding={binding} />
                </DocumentTitle>
              </div>
            </div>
          </div>
        </div>
      )
    }
});

module.exports = App;

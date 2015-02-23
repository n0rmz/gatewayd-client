'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Router = require('react-router');
var {Route, Redirect, RouteHandler, Link} = Router;

var DocumentTitle = require('react-document-title');
var TopBar = require('scripts/shared/components/header/top-bar.jsx');
var Sidebar = require('scripts/shared/components/sidebar.jsx');

// required to use React Bootstrap in child modules
require('react-bootstrap');

var topBarConfig = {
  wrapperClassName: 'navbar-inverse navbar-fixed-top top-bar container-fluid'
};

var App =
  React.createClass({

    mixins: [IntlMixin],

    getInitialState: function() {
      return {showSidebar: false};
    },

    expandSidebar: function() {
      this.setState({showSidebar: this.state.showSidebar ? false : true});
    },

    render: function(){
      return (
        <div>
          <TopBar
            brandName={topBarConfig.brandName}
            wrapperClassName={topBarConfig.wrapperClassName}
            expandSidebar={this.expandSidebar}
          />
          {this.state.showSidebar ?
            <Sidebar sidebarClassName='sidebar sidebar-wallets'></Sidebar> : false
          }
          <RouteHandler/>
        </div>
      )
    }
});

module.exports = App;

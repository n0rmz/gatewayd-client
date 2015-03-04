"use strict";

var React = require('react');
var Branding = require('./branding.jsx');
var NavLinks = require('./nav-links.jsx');

var topNavigation = [
  {
    text: 'Get Quote',
    href: '/get-quote'
  },
  {
    text: 'Manual Transactions',
    href: '/external-transactions'
  },
  {
    text: 'Accounts',
    href: '/external-accounts'
  },
  {
    text: 'Ripple',
    href: '/ripple-transactions'
  }
];

var TopBar = React.createClass({
  getDefaultProps: function() {
    return {
      wrapperClassName: 'navbar'
    };
  },

  propTypes: {
    brandName: React.PropTypes.string,
    wrapperClassName: React.PropTypes.string
  },

  handleExpand: function(e) {
    e.preventDefault();
    this.props.expandSidebar();
  },

  render: function() {
    var nav = false;

    return (
      <div className={this.props.wrapperClassName}>
        <Branding
          wrapperClassName={this.props.brandingClassName}
        />
        <NavLinks
          links={topNavigation}
          navLinksClassName='nav nav-primary navbar-nav'
        />
      </div>
    );
  }
});

module.exports = TopBar;

'use strict';

var React = require('react');
var Navigation = require('react-router').Navigation;

var NavLinks = require('../shared/components/nav-links/nav-links.jsx');
var NavSecondary = React.createClass({

  getDefaultProps: function() {
    return {
      links: [{
        text: 'Withdrawals',
        href: '/payments/withdrawals/queued'
      },
      {
        text: 'Deposits',
        href: '/payments/deposits/queued'
      }],
      wrapperClassName: 'foo',
      navLinksClassName: 'nav-secondary'
    };
  },

  render: function() {
    return (
      <div className={this.props.wrapperClassName}>
        <NavLinks
          links={this.props.links}
          className={this.props.navLinksClassName}/>
      </div>
    );
  }
});

module.exports = NavSecondary;

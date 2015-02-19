"use strict";

var React = require('react');
var Branding = require('./branding.jsx');

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
      </div>
    );
  }
});

module.exports = TopBar;

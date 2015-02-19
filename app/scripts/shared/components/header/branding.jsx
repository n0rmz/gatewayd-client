"use strict";

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');

//todo: make a mixin with string methods
var capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var Branding = React.createClass({

  mixins: [IntlMixin],

  getDefaultProps: function() {
    return {
      brandingClassName: 'header-branding'
    };
  },

  propTypes: {
    brandName: React.PropTypes.string
  },

  getBrandName: function() {
    return (
      <span>
        {capitalize(location.hostname)}&nbsp;|&nbsp;
        <FormattedMessage message={this.getIntlMessage('branding')} />
      </span>
    );
  },

  render: function() {
    return (
      <div className={this.props.brandingClassName}>
        <a className="navbar-brand" href="/">
          {this.getBrandName()}
        </a>
      </div>
    );
  }
});

module.exports = Branding;

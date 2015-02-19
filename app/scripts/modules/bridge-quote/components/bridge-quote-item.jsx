"use strict";

var _ = require('lodash');
var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Button = require('react-bootstrap').Button;

var BridgeQuoteItem = React.createClass({

  mixins: [IntlMixin],

  propTypes: {
    id: React.PropTypes.string,
    quoteData: React.PropTypes.object,
    handleClick: React.PropTypes.func,
    isDisabled: React.PropTypes.bool
  },

  acceptQuote: function() {
    this.props.handleClick(this.props.id);
  },

  render: function() {
    var itemLabel, submitButton;

    itemLabel = <FormattedMessage message={this.getIntlMessage('quoteItemLabel')} />;
    submitButton = <FormattedMessage message={this.getIntlMessage('quoteItemSubmit')} />;

    return (
      <li className="list-group-item payment-item">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-2 col-xs-12">
            <p>
              <span className="header">{itemLabel}</span>
              <span className="data">{this.props.quoteData.amount} </span>
              <span className="currency">{this.props.quoteData.currency}</span>
            </p>
          </div>
          <div className="col-sm-3 col-xs-12">
            <Button
              bsStyle="info"
              onClick={this.acceptQuote}
              disabled={this.props.isDisabled}
            >
              {submitButton}
            </Button>
          </div>
        </div>
      </li>
    );
  }
});

module.exports = BridgeQuoteItem;

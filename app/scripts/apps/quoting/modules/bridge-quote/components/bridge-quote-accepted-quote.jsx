'use strict';

var _ = require('lodash');
var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedHTMLMessage = ReactIntl.FormattedHTMLMessage;
var React = require('react');
var Button = require('react-bootstrap').Button;

var BridgeQuoteAcceptedQuote = React.createClass({

  mixins: [IntlMixin],

  propTypes: {
    amount: React.PropTypes.number,
    currency: React.PropTypes.string,
    debitAccount: React.PropTypes.string,
    creditAccount: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      wrapperClassName: ''
    };
  },

  getConfirmationMessage: function() {
    var amount = this.props.amount,
        currency = this.props.currency,
        debitAccount = this.props.debitAccount,
        creditAccount = this.props.creditAccount;

    if (_.isNull(amount) && _.isEmpty(currency) && _.isEmpty(creditAccount)) {
      return false;
    }

    return (
      <div>
        <h4>
          <FormattedMessage message={this.getIntlMessage('transferHeader')} />
        </h4>
        <ul className='list-group'>
          <li className='list-group-item payment-item' key={_.uniqueId()}>
            <div className='row'>
              <div className='col-sm-6 col-xs-12 col-sm-offset-2'>
                <p>
                  <span className='header'>
                    <FormattedMessage message={this.getIntlMessage('transferAmountHeader')} />
                  </span>
                  <span className='data'>{amount} </span>
                  <span className='currency'>{currency}</span>
                </p>
                <p>
                  <span className='header'>
                    <FormattedMessage message={this.getIntlMessage('transferDebitAccount')} />
                  </span>
                  <span className='data'>{debitAccount}</span>
                </p>
                <p>
                  <span className='header'>
                    <FormattedMessage message={this.getIntlMessage('transferCreditAccount')} />
                  </span>
                  <span className='data'>{creditAccount}</span>
                </p>
              </div>
              <div className='col-sm-4 col-xs-12'>
                <Button bsStyle='info' disabled={true}>
                  <FormattedMessage message={this.getIntlMessage('transferSubmit')} />
                </Button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  },

  render: function() {
    return(
      <div className={this.props.wrapperClassName}>
        {this.getConfirmationMessage()}
      </div>
    );
  }
});

module.exports = BridgeQuoteAcceptedQuote;

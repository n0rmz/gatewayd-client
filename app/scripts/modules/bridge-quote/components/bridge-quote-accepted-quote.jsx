"use strict";

var _ = require('lodash');
var React = require('react');
var Button = require('react-bootstrap').Button;

var BridgeQuoteAcceptedQuote = React.createClass({
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

  render: function() {
    var amount = this.props.amount;
    var currency = this.props.currency;
    var debitAccount = this.props.debitAccount;
    var creditAccount = this.props.creditAccount;
    var contentToRender = '';
    var confirmationMessage = (
      <div>
        <h4>Transfer Prepared:</h4>
        <ul className="list-group">
          <li className="list-group-item payment-item" key={_.uniqueId()}>
            <div className="row">
              <div className="col-sm-6 col-xs-12 col-sm-offset-2">
                <p>
                  <span className="header">Amount: </span>
                  <span className="data">{amount} </span>
                  <span className="currency">{currency}</span>
                </p>
                <p>
                  <span className="header">Debit Account: </span>
                  <span className="data">{debitAccount}</span>
                </p>
                <p>
                  <span className="header">Credit Account: </span>
                  <span className="data">{creditAccount}</span>
                </p>
              </div>
              <div className="col-sm-4 col-xs-12">
                <Button bsStyle="info" disabled={true}>
                  Transfer Funds
                </Button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );

    // render confirmation message only after quote has been accepted
    if (!_.isNull(amount) && !_.isEmpty(currency) && !_.isEmpty(creditAccount)) {
      contentToRender = confirmationMessage;
    }

    return(
      <div className={this.props.wrapperClassName}>
        {contentToRender}
      </div>
    );
  }
});

module.exports = BridgeQuoteAcceptedQuote;

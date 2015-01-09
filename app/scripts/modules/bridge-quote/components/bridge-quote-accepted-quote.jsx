"use strict";

var _ = require('lodash');
var React = require('react');
var Button = require('react-bootstrap').Button;

var BridgeQuoteAcceptedQuote = React.createClass({
  propTypes: {
    amount: React.PropTypes.string, // number
    currency: React.PropTypes.string,
    destinationAddress: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      wrapperClassName: ''
    };
  },

  render: function() {
    var amount = this.props.amount;
    var currency = this.props.currency;
    var destinationAddress = this.props.destinationAddress;
    var contentToRender = '';
    var confirmationMessage = (
      <div>
        <h4>Quote Accepted</h4>
        <ul className="list-group">
          <li className="list-group-item" key={_.uniqueId()}>
            <div className="row">
              <div className="col-sm-10 col-sm-offset-2">
                We are ready to receive your payment
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-10 col-sm-offset-2">
                Please send {amount} {currency} to {destinationAddress}
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-6 col-sm-offset-4">
                <Button bsStyle="info" disabled={true}>
                  Proceed to Pay Invoice
                </Button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );

    if (!_.isNull(amount) && !_.isEmpty(currency) && !_.isEmpty(destinationAddress)) {
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

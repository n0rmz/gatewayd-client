"use strict";

var path = require('path');
var _ = require('lodash');
var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var $ = require('jquery');
var addressActions = require('../actions');
var AddressModel = require('../models/ripple-address');
var addressModel = new AddressModel();

var RippleAddressLookup = React.createClass({

  getDefaultProps: function() {
    return {
      placeholder: '',
      id: '',
      wrapperClassName: '',
      label: '',
      labelClassName: ''
    };
  },

  getInitialState: function() {
    return {
      federatedAddress: '',
      inputState: null,
      message: ''
    };
  },

  componentDidMount: function() {
    addressModel.on("error", this.handleError);
    addressModel.on("change:federatedAddress", this.setAddress);
    addressModel.on("change:links", this.handleLinks);
  },

  componentWillUnmount: function() {
    addressModel.off("error change");
  },

  setAddress: function(model, address) {
    this.clearInputState();

    //update dom
    this.setState({federatedAddress: address});
  },

  handleChange: function(e) {
    addressActions.setFederatedAddress(e.target.value);
  },

  handleSubmit: function(e) {
    e.preventDefault();

    addressActions.resolveAddress(e.target.value);
  },

  findQuoteLink: function(links) {
    var findKey = 'https://gatewayd.org/gateway-services/bridge_payments';

    //given links object, return the bridge quote link
    //NOTE: 'template' is likely to change to 'ref' when updated to spec
    return _.find(links, function(link) {
      return link.rel === findKey;
    }).template;
  },

  handleLinks: function(model, links) {
    links = links || [];

    if (!links.length) {
      return false;
    }

    //get data from model and pass to success/callback
    this.handleSuccess(model.get('federatedAddress'), this.findQuoteLink(links));
  },

  handleSuccess: function(address, link) {

    //handle optional callback
    if (this.props.onSuccessCb) {
      this.props.onSuccessCb({
        bridgeQuoteUrl: link,
        federatedAddress: address
      });
    }

    this.setState({inputState: 'success'});
    this.setMessage();
  },

  handleError: function(model, response) {
    this.setState({inputState: 'error'});
    this.setMessage(response.responseJSON.error);
  },

  clearInputState: function() {
    this.setState({inputState: null});
    this.setMessage();
  },

  messages: {
    empty: '',
    GatewayUserNotFound: 'There is no user with that address at this gateway',
    InvalidEmailFormat: 'The address does not appear to be valid'
  },

  setMessage: function(message) {
    message = message || 'empty';

    this.setState({message: message});
  },

  render: function() {
    var isDisabled = (this.props.isDisabled === true) ? true : false;
    var button = <Button disabled={isDisabled} className="btn-primary" onClick={this.handleSubmit}>Check Address</Button>;

    //todo: set this up for all alert types
    var alert = (this.state.inputState === "error") ?
      <div className="alert alert-danger">
        {this.state.message}
      </div> : false;


    return (
      <form onSubmit={this.handleSubmit} className={this.props.wrapperClassName}>
        <div className="form-group">
          <Input
            disabled={isDisabled}
            type="text"
            id={this.props.id}
            label={this.props.label}
            labelClassName={this.props.labelClassName}
            placeholder={this.props.placeholder}
            value={this.state.federatedAddress}
            className="form-control"
            buttonAfter={button}
            onChange={this.handleChange}
            bsStyle={this.state.inputState}
            hasFeedback
            autoFocus={true}
          />
          {alert}
        </div>
      </form>
    );
  }
});

module.exports = RippleAddressLookup;

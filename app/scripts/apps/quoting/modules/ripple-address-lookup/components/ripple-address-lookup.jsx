'use strict';

var _ = require('lodash');
var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Actions = require('scripts/actions');
var AddressModel = require('../models/ripple-address');
var addressModel = new AddressModel();

var RippleAddressLookup = React.createClass({

  mixins: [IntlMixin],

  getDefaultProps: function() {
    return {
      id: '',
      wrapperClassName: '',
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
    addressModel.on('error', this.handleError);
    addressModel.on('change:federatedAddress', this.setAddress);
    addressModel.on('change:links', this.handleLinks);
  },

  componentWillUnmount: function() {
    addressModel.off();
  },

  setAddress: function(model, address) {
    this.clearInputState();

    // update dom
    this.setState({federatedAddress: address});
  },

  handleChange: function(e) {
    Actions.setFederatedAddress(e.target.value);
  },

  handleSubmit: function(e) {
    e.preventDefault();

    Actions.resolveAddress(e.target.value);
  },

  findQuoteLink: function(links) {

    // this is less than optimal. The api should be more deterministic imo
    var findKey = /gateway-services\/bridge_payments$/;

    // given links object, return the bridge quote link
    // NOTE: 'template' is likely to change to 'ref' when updated to spec
    return _.find(links, function(link) {
      return link.rel.match(findKey);
    }).template;
  },

  handleLinks: function(model, links) {
    links = links || [];

    if (!links.length) {
      return false;
    }

    // get data from model and pass to success/callback
    this.handleSuccess(model.get('federatedAddress'),
                       this.findQuoteLink(links));
  },

  handleSuccess: function(address, link) {

    // handle optional callback
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
    var errorMessage;

    // handle all error objects in order
    if (response.responseJSON) {
      errorMessage = response.responseJSON.error || 'Error';
    } else {
      errorMessage = response.statusText || 'Error';
    }

    this.setState({inputState: 'error'});
    this.setMessage(errorMessage);
  },

  clearInputState: function() {
    this.setState({inputState: null});
    this.setMessage();
  },

  setMessage: function(message) {
    message = message || 'empty';

    this.setState({message: message});
  },

  render: function() {
    var isActive, button, alert, label;

    isActive = this.props.isActive;
    button = (<Button
      disabled = {!isActive}
      className = 'btn-primary'
      onClick = {this.handleSubmit}>
      <FormattedMessage
        message={this.getIntlMessage('webfingerLookupSubmit')}
      />
    </Button>);

    label = <FormattedMessage message={this.getIntlMessage('senderLabel')} />;

    // todo: set this up for all alert types
    // won't localize errors at this time
    // strings returned from server
    alert = (this.state.inputState === 'error') ?
      <div className='alert alert-danger'>
        {this.state.message}
      </div> : false;

    return (
      <form
        onSubmit={this.handleSubmit}
        className={this.props.wrapperClassName}
      >
        <div className='form-group'>
          <Input
            disabled={!isActive}
            type='text'
            id={this.props.id}
            label={label}
            placeholder={this.getIntlMessage('senderPlaceholder')}
            labelClassName={this.props.labelClassName}
            value={this.state.federatedAddress}
            className='form-control'
            buttonAfter={button}
            onChange={this.handleChange}
            bsStyle={this.state.inputState}
            autoFocus={true}
            hasFeedback
          />
          {alert}
        </div>
      </form>
    );
  }
});

module.exports = RippleAddressLookup;

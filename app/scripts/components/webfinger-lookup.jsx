'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Morearty = require('morearty');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ActionCreators = require('../actions/ActionCreators');

var WebfingerLookup = React.createClass({

  mixins: [IntlMixin, Morearty.Mixin],

  propTypes: {
    onSuccessCb: React.PropTypes.func,
    wrapperClassName: React.PropTypes.string.isRequired,
    labelClassName: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      onSuccessCb: function() {},
      id: '',
      wrapperClassName: '',
      labelClassName: ''
    };
  },

  handleChange: function(e) {
    ActionCreators.setFederatedAddress(e.target.value);
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var binding = this.getBinding();

    ActionCreators.getQuotingAddress(binding.get('federatedAddress'));
  },

  componentWillMount: function() {

    // any changes to the bridgeQuoteUrl data, set only on successful webfinger,
    // will invoke the onSuccessCallback from the parent
    this.addBindingListener(this.getBinding(), 'bridgeQuoteUrl', () => {
      var binding = this.getBinding();

      this.props.onSuccessCb({
        bridgeQuoteUrl: binding.get('bridgeQuoteUrl'),
        federatedAddress: binding.get('federatedAddress')
      });
    });
  },

  render: function() {
    var binding = this.getBinding();

    var isActive, button, label, alert;

    isActive = this.props.isActive;

    button = (
      <Button disabled={!isActive} className='btn-primary'>
        <FormattedMessage
          message={this.getIntlMessage('webfingerLookupSubmit')}
        />
      </Button>
    );

    label = <FormattedMessage message={this.getIntlMessage('senderLabel')} />;

    //todo: set this up for all alert types
    //won't localize errors at this time
    //strings returned from server
    alert = (binding.get('inputState') === 'error') ?
      <div className='alert alert-danger'>
        {binding.get('message')}
      </div> : false;

    return (
      <form onSubmit={this.handleSubmit} className={this.props.wrapperClassName}>
        <div className='form-group'>
          <Input
            id={this.props.id}
            type='text'
            className='form-control'
            bsStyle={binding.get('inputState')}
            labelClassName={this.props.labelClassName}
            label={label}
            buttonAfter={button}
            placeholder={this.getIntlMessage('senderPlaceholder')}
            value={binding.get('federatedAddress')}
            onChange={this.handleChange}
            disabled={!isActive}
            autoFocus={true}
            hasFeedback
          />
          {alert}
        </div>
      </form>
    );
  }
});

module.exports = WebfingerLookup;

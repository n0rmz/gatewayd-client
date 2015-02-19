'use strict';

var React = require('react');
var Morearty = require('morearty');
var Input = require('react-bootstrap').Input;
var Label = require('react-bootstrap').Label;
var ActionCreators = require('../actions/ActionCreators');

var InputWithValidation = React.createClass({

  mixins: [Morearty.Mixin],

  propTypes: {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    addonBefore: React.PropTypes.string,
    addonAfter: React.PropTypes.string
  },

  getDefaults: function() {
    return {
      name: '',
      type: 'text'
    };
  },

  handleChange: function(e) {
    ActionCreators.setInput(this.props.name, e.target.value);
  },

  handleBlur: function(e) {
    ActionCreators.validateInput(this.props.name, e.target.value);
  },

  requiredLabel: function(labelName) {
    return (
      <div>
        <Label bsStyle="info">Required</Label> {labelName}
      </div>
    );
  },

  errorMessageLabel: function(errorMessage) {
    return (
      <Label bsStyle="warning">{errorMessage}</Label>
    );
  },

  render: function() {
    var binding = this.getBinding();

    return (
      <div>
        <Input
          type={this.props.type}
          addonBefore={this.props.addonBefore}
          addonAfter={this.props.addonAfter}
          label={binding.get('label')}
          bsStyle={binding.get('bsStyle')}
          value={binding.get('value')}
          disabled={binding.get('isDisabled')}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          hasFeedback
        />
        {this.errorMessageLabel(binding.get('errorMessage'))}
      </div>
    );
  }
});

module.exports = InputWithValidation;

"use strict";

var _ = require('lodash');
var React = require('react');

var FlowStep = React.createClass({

  //I need to know:
  //what step am I?
  //am I active?
  //should I hide if inactive?
  //what callbacks need to be passed?
  //what values need to be passed up?
  getDefaultProps: function() {
    return {
      thisStep:'',
      activeStep:'',
      hideIfInactive: false,
      stepComponent: false
    };
  },

  propTypes: {
    thisStep: React.PropTypes.number,
    activeStep: React.PropTypes.number,
    hideIfInactive: React.PropTypes.bool,
    stepComponent: React.PropTypes.func.isRequired
  },

  onStepComplete: function() {
  },

  render: function() {
    var isActive, childArgs, getWrapperClass;

    isActive = (this.props.thisStep === this.props.activeStep);
    childArgs = _.extend({isActive: isActive}, this.props.childArgs);
    getWrapperClass = function(hideIfInactive) {
      var className = ['flow-step'];

      className.push(isActive ? 'active' : 'disabled');

      if (hideIfInactive && !isActive) {
        className.push('hide');
      }

      return className.join(' ');
    };

    return (
      <div className={getWrapperClass(this.props.hideIfInactive)}>
        <this.props.stepComponent {...childArgs} />
      </div>
    );
  }
});

module.exports = FlowStep;

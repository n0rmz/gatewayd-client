'use strict';

var _ = require('lodash');
var React = require('react');
var Morearty = require('morearty');

var FlowStep = React.createClass({

  mixins: [Morearty.Mixin],

  propTypes: {
    thisStep: React.PropTypes.number,
    activeStep: React.PropTypes.number,
    childArgs: React.PropTypes.object.isRequired,
    hideIfInactive: React.PropTypes.bool,
    stepComponent: React.PropTypes.func.isRequired
  },

  //I need to know:
  //what step am I?
  //am I active?
  //should I hide if inactive?
  //what callbacks need to be passed?
  //what values need to be passed up?
  getDefaultProps: function() {
    return {
      thisStep: 1,
      activeStep: 1,
      childArgs: {},
      hideIfInactive: false,
      stepComponent: false
    };
  },

  render: function() {
    var cx, isActive, classes, childArgs;

    cx = React.addons.classSet;

    isActive = (this.props.thisStep === this.props.activeStep);

    classes = cx({
      'flow-step': true,
      'active': isActive,
      'disabled': !isActive,
      'hide': this.props.hideIfInactive && !isActive
    });

    childArgs = _.extend({isActive: isActive}, this.props.childArgs);

    return (
      <div className={classes}>
        <this.props.stepComponent {...childArgs} />
      </div>
    );
  }
});

module.exports = FlowStep;

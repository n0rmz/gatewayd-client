# Javascript Style Guide

The Ripple Labs style guide is defined by the eslintrc file in this repository along with the supplemental rules listed below.

# Additional Rules not covered by ESLint
  - Declare variables in the deepest possible block and as close to their use as possible (the linter will catch issues with hoisting)
  - Use soft tabs set to 2 spaces
  - Use a leading underscore `_` when naming private properties
  - Use `stack.push(x)` instead of `stack[stack.length] = x`
  - Copy arrays with `Array.slice`
  - Convert array-like objects to arrays with `Array.prototype.slice.call(arguments)`
  - Strings longer than 80 characters should be written across multiple lines using string concatenation.
  - Never name a parameter `arguments`, this will take precedence over the `arguments` object that is given to every function scope.
  - Assign methods to the prototype object, instead of overwriting the prototype with a new object. Overwriting the prototype makes inheritance impossible: by resetting the prototype you'll overwrite the base!
  - When attaching data payloads to events (whether DOM events or something more proprietary like Backbone events), pass a hash instead of a raw value. This allows a subsequent contributor to add more data to the event payload without finding and updating every handler for the event. For example, instead of:

# Editor Configuration

It is recommended that you configure your text editor to show linter errors while you are typing.

## Sublime Text 3

Note that Sublime Text can optionally be configured for vim or emacs key bindings.

  - Copy eslintrc to ~/.eslintrc
  - Install [Package Control](https://packagecontrol.io/installation)
  - Install [SublimeLinter](http://www.sublimelinter.com/en/latest/installation.html#installing-via-pc)
  - Install [SublimeLinter-contrib-eslint](https://packagecontrol.io/packages/SublimeLinter-contrib-eslint)

# TODO: Write ESLint rules for
  - Never name a parameter `arguments`
  - Never assign `<Function>.prototype = ...`
  - Warn when a variable is explicitly re-assigned

# Resources
The rules in the previous section are from the [Airbnb Style Guide](https://github.com/airbnb/javascript)

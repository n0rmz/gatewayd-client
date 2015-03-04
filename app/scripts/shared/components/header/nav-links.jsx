'use strict';

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var {Route, Redirect, RouteHandler, Link, State} = Router;
const HandleActiveState = require('scripts/shared/mixins/components/handle-active-state');

/*
  Sample links array:

  [
    {
      text: 'Login',
      href: '/login'
    },
    {
      text: 'Main',
      href: '/'
    },
    {
      text: 'Logout',
      href: '/logout'
    }
  ]
*/

var NavLinks = React.createClass({

  mixins: [State, HandleActiveState],

  propTypes: {
    links: React.PropTypes.array,
    navLinksClassName: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      navLinksClassName: 'nav navbar-nav'
    };
  },

  getLinks: function(links) {
    var items = _.map(links, (link, i) => {

      return (
        <li key={i++}>
          <Link to={link.href} className={this.handleActiveState(link)}>
            {link.text}
          </Link>
        </li>
      );
    });

    return items;
  },

  render: function() {
    var links = this.getLinks(this.props.links);

    return (
      <ul className={this.props.navLinksClassName}>
        {links}
      </ul>
    );
  }
});

module.exports = NavLinks;

'use strict';

const ActiveStateMixin = {
  handleActiveState: function(link) {
    let pathname = this.getPathname(),
        pathnameLength = pathname.length,
        href = link.href,
        navUrlLength = href.length,
        className = '';

    if (navUrlLength < 2 || navUrlLength > pathnameLength) {
      return className;
    }

    if (href === pathname.substring(0, navUrlLength)) {
      className = 'active';
    }

    return className;
  }
};

module.exports = ActiveStateMixin;

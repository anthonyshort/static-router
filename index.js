// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Cached regex for stripping a leading hash/slash and trailing space.
var routeStripper = /^[#\/]|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

// Cached regex for removing a trailing slash.
var trailingSlash = /\/$/;

function Router() {
  this._callbacks = {};
  this.location = window.location;
  this.handlers = [];

  // Normalize root to always include a leading and trailing slash.
  this.root = options.root || '/';
  this.root = ('/' + this.root + '/').replace(rootStripper, '/');
}

// Convert a route as a string into a Regex object
// we can use to match the URL
Router.prototype._routeToRegExp = function(route) {
  route = route.replace(escapeRegExp, '\\$&')
               .replace(optionalParam, '(?:$1)?')
               .replace(namedParam, function(match, optional){
                 return optional ? match : '([^\/]+)';
               })
               .replace(splatParam, '(.*?)');
  return new RegExp('^' + route + '$');
};

// Attempt to load the current URL fragment. If a route succeeds with a
// match, returns `true`. If no defined routes matches the fragment,
// returns `false`.
Router.prototype.loadUrl = function(fragmentOverride) {
  var fragment = fragmentOverride || this.getFragment();
  var matched = _.any(this.handlers, function(handler) {
    if (handler.route.test(fragment)) {
      handler.callback(fragment);
      return true;
    }
  });
  return matched;
};

// Given a route, and a URL fragment that it matches, return the array of
// extracted parameters.
Router.prototype._extractParameters = function(route, fragment) {
  return route.exec(fragment).slice(1);
};

Router.prototype.getFragment = function() {
  var fragment = this.location.pathname;
  var root = this.root.replace(trailingSlash, '');
  if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
  return fragment.replace(routeStripper, '');
};

Router.prototype.route = function(route, callback) {
  route = routeToRegExp(route);
  this.loadUrl();
};

module.exports = Router;
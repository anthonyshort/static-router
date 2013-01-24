// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Cached regex for stripping a leading hash/slash and trailing space.
var routeStripper = /^[#\/]|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

// Cached regex for removing a trailing slash.
var trailingSlash = /\/$/;

function Router(options) {
  options = options || {};
  this._handlers = [];
  this.setRoot(options.root || '/');
  this.setUrl(options.url || window.location.pathname);
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

// Set the root URL for all routes
Router.prototype.setRoot = function(url) {
  this.root = this._normalizeUrl(url);
};

Router.prototype.setUrl = function(url) {
  this.url = this._normalizeUrl(url);
};

// Given a route, and a URL fragment that it matches, return the array of
// extracted parameters.
Router.prototype._extractParameters = function(route, fragment) {
  return route.exec(fragment).slice(1);
};

// Makes sure all urls have a leading slash and no trailing slash
// Used to normalize all urls so we always know the format
Router.prototype._normalizeUrl = function(url) {
  return ('/' + url + '/').replace(rootStripper, '/');
};

Router.prototype.getFragment = function() {
  var fragment = this.url;
  var root = this.root.replace(trailingSlash, '');
  if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
  return fragment.replace(trailingSlash, '');
};

// Add a route and a callback. The callback won't
// be fired immediately but when the router is started
Router.prototype.route = function(route, callback) {
  var fragment = this.getFragment();
  var routeRegex = this._routeToRegExp(route);

  if ( routeRegex.test(fragment) ) {
    var args = this._extractParameters(routeRegex, fragment);
    callback.apply(this, args);
  }
};

module.exports = Router;
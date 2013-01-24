
# static-router

  Simple router to match URLs and fire callbacks without pushState. Designed for simple sites who want to structure code using routes but don't need pushState. Borrowed heavily from Backbone's router object. It's a lot better than just throwing everything in a global scope.

## Installation

    $ component install anthonyshort/static-router

## API

   var Router = require('static-router');
   var router = new Router();

   router.route('/welcome', function(){
    alert('Welcome page!');
   });

   router.route('/profile/:user', function(user){
    console.log(user);
   });

   router.route('/profile/*', function(){
    console.log('match anything after profile!');
   });

## License

  MIT

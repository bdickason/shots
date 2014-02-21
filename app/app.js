/* Main app js file */

app = {};

window.onload = function(){
    Backbone.$ = window.$;

    // Firebase.enableLogging(true);

    app.utils = require('./utils.js');

    app.fbUrl = 'https://shots.firebaseio.com';
    app.user = {};

    /* Authentication via Twitter/Firebase */
    var fbRef = new Firebase(app.fbUrl);
    app.auth = new FirebaseSimpleLogin(fbRef, function(error, user) {
      if(user) {
        // Login was successful
        app.user.displayName = user.displayName;
        app.user.username = user.username;
        app.user.profile_image = user.profile_image_url_https;
      }
      else {
        console.log(error);
      }
    });

    var Routes = require('./routes.js');
    
    app.router = new Routes(); // Routes control the app and start everything up, depending on location

    Backbone.history.start();
};


/* Main app js file */

userModel = require('./models/userModel.js');
app = {};

window.onload = function(){
    Backbone.$ = window.$;

    // Firebase.enableLogging(true);

    app.utils = require('./utils.js');

    app.fbUrl = 'https://shots.firebaseio.com';
    app.user = new userModel(); // Attempts to authenticate the current user

    var Routes = require('./routes.js');
    
    app.router = new Routes(); // Routes control the app and start everything up, depending on location

    Backbone.history.start();
};


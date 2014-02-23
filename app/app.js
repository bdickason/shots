/* Main app js file */

userModel = require('./users/userModel.js');
app = {};
app.views = [];

window.onload = function(){
    Backbone.$ = window.$;
    app.Handlebars = require('hbsfy/runtime');  // Needed for Handlebars mixins in utils.js

    // Firebase.enableLogging(true);

    app.utils = require('./utils.js');

    app.fbUrl = 'https://shots.firebaseio.com';
    app.user = new userModel(); // Attempts to authenticate the current user

    var Routes = require('./routes.js');
    
    app.router = new Routes(); // Routes control the app and start everything up, depending on location

    Backbone.history.start();
};


/* Main app js file */

app = {};

window.onload = function(){
    Backbone.$ = window.$;

    app.utils = require('./utils.js');

    app.fbUrl = 'https://shots.firebaseio.com';

    var Routes = require('./routes.js');

    app.router = new Routes(); // Routes control the app and start everything up, depending on location
    Backbone.history.start();
};


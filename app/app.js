/* Main app js file */

Backbone.$ = window.$;

var userModel = require('./components/users/loginModel.js');

app = new Backbone.Marionette.Application();


app.on('initialize:after', function() {
    // Configure the app
     
    // Regions define areas in the template (/server/views/client.handlebars) that we'll insert content into
    app.addRegions({
        header: 'nav#primary',      // Used for main nav
        subhead: "nav#secondary",    // Used for secondary nav
        content: 'section#content',    // Used for main content
        footer: 'footer'       // Stuff everything else here?
    });

    // Generic utility functions used throughout the app
    app.utils = require('./utils.js');

    // Firebase URL for accessing data
    app.fbUrl = 'https://shots.firebaseio.com';

    // User authentication (via Firebase)
    app.user = new userModel(); // Attempts to authenticate the current user

    // Setup router
    var Routes = require('./routes.js');

    app.router = new Routes(); // Routes control the app and start everything up, depending on location

    // Starting the router allows us to accept url's (defined below in app.router)
    Backbone.history.start({pushState: true});
});

window.onload = function(){
    app.start();    // Starts the app
};


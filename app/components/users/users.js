/* Users Controller - Ties together Layout, View, and Model/Controllers */

// Views
var UserCardView = require('./show/userCardView.js');

// Models
var UserModelFirebase = require('./models/userModelFirebase.js');

module.exports.Save = Backbone.Marionette.Controller.extend({
    /* Save - Creates or Updates a valid user for displaying elsewhere
     Inputs:
        username: Twitter user name (also used as ID currently) (Required)
        displayName: Twitter Display Name
        profileImage: Twitter profile image
        lastLogin: Date of last login to Shots
    */
    initialize: function(options) {
        this.id = options.username;
        options.id = options.username;
        
        this.user = new UserModelFirebase({id: this.id});
        this.user.set(options);
   }
});
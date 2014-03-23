/* User Model - Standalone model integrated w/ Firebase simple login 

displayName: User's full name
profileImage: User's avatar
username: user's handle
*/

var Users = require('../users.js');

module.exports = Backbone.Model.extend({
    initialize: function() {
      /* Authentication via Twitter/Firebase */
      var fbRef = new Firebase(app.fbUrl);
      var model = this;

      // Firebase auth library, triggered on sign in/sign out
      app.auth = new FirebaseSimpleLogin(fbRef, function(error, user) {

        if(user) {
          // Login was successful
          userData = {
            displayName: user.displayName,
            profileImage: user.profile_image_url_https,
            lastLogin: new Date(),
            username: user.username,
            loggedIn: true
          };
          model.set(userData);

          // Save user data in firebase
          model.saveUser(userData);

          mixpanel.identify(userData.username);
          mixpanel.people.set({
            "$last_login": userData.lastLogin,
            "$name": userData.displayName,
            "$username": userData.username,
            "service": "Twitter"
          });
        }
        else {
          // User logged out
          model.clear();
        }
      });
    },
    saveUser: function(userData) {
      var userModel = new Users.Save(userData);
    },
    login: function(service) {
      // Logs a user into the app
      app.auth.login(service);
    },
    logout: function() {
      // Logs a user out of the app
      app.auth.logout();
    }
});

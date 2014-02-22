/* User Model - Standalone model integrated w/ Firebase simple login */

module.exports = Backbone.Model.extend({
    initialize: function() {
      /* Authentication via Twitter/Firebase */
      var fbRef = new Firebase(app.fbUrl);
      var model = this;
      app.auth = new FirebaseSimpleLogin(fbRef, function(error, user) {
        if(user) {
          // Login was successful
          userData = {
            displayName: user.displayName,
            profileImage: user.profile_image_url_https,
            username: user.username,
            loggedIn: true
          };
          model.set(userData);
        }
        else {
          console.log(error);
        }
      });
    }
});

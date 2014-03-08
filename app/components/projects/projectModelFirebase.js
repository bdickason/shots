/* Project Model - For standalone use (not in a collection) */

var utils = require('../../utils.js');

module.exports = Backbone.Firebase.Model.extend({
  firebase: function() {
    return(new Firebase(this.fbUrl));
  },
  initialize: function() {
    this.fbUrl = app.fbUrl + '/projects/' + this.get('id');
  },
  isOwner: function(user) {
    if(this.get('user') == user) {
      return(true);
    } else {
      return(false);
    }
  },
  toJSON: function() {
    var output = utils.formatTime(this);  // Generate human-readable timestamp
    
    var currentUser = app.user.get('username');

    if(currentUser) {
      if(this.isOwner(currentUser)) {
        // User owns this project
        output.owner = true;
      }
    }
    
    return(output);
  }
});

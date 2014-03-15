/* Project Model - data layer for a single Project for use in Firebase Collections */

var utils = require('../../utils.js');

module.exports = Backbone.Model.extend({
  initialize: function() {
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

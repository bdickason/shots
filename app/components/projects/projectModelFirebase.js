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
    
    if(this.get('user') === app.user.get('username')) {
      // User owns this comment
      output.owner = true;
    }
    
    return(output);         // Generate human-readable timestamp
  }
});

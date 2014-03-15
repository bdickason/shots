/* Shot Model - Standalone model (do not use in collections) */

var utils = require('../../utils.js');

module.exports = Backbone.Firebase.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/shots/' + this.get('projectId') + '/' + this.get('id');
    },
    defaults: {
      text: ''
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

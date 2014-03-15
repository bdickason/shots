/* Shot Model - data layer for a single Shot */

var utils = require('../../utils.js');

module.exports = Backbone.Model.extend({
    initialize: function() {
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

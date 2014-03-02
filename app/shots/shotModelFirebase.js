/* Shot Model - Standalone model (do not use in collections) */

var utils = require('../utils.js');

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
        return(utils.formatTime(this));         // Generate human-readable timestamp
    }
});

/* Shot Model - Standalone model (do not use in collections) */

var moment = require('moment');

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
        // Generate custom timestamp
        var json = Backbone.Model.prototype.toJSON.call(this);  // Get existing toJSON data
        json.time = moment(this.get('timestamp')).format('h:mm');
        console.log(json.time);
        return(json);
    }
});

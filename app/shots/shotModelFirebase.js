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
        json.time = moment(this.get('timestamp')).fromNow();    // Get time in the format Time from Now: http://momentjs.com/docs/#/displaying/fromnow/
        return(json);
    }
});

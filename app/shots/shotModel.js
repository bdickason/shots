/* Shot Model - data layer for a single Shot */

var moment = require('moment');

module.exports = Backbone.Model.extend({
    initialize: function() {
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

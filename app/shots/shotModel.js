/* Shot Model - data layer for a single Shot */

var utils = require('../utils.js');

module.exports = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
      text: ''
    },
    toJSON: function() {
        return(utils.formatTime(this));         // Generate human-readable timestamp
    }
});

/* Shots Collection - An ordered list of Shots */
var ShotModel = require('./shotModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ShotModel,
    comparator: function(model) {
      // Sorts model by timestamp, newest first
      return(-model.get('timestamp'));
    },
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function(models, options) {
        this.fbUrl = app.fbUrl + '/shots/' + options.project;
    }
  });
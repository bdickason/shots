/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.Collection.extend({
    model: ShotModel,
    firebase: function() {
      return(new Firebase(this.fbUrl));
    },
    initialize: function(models, projectId) {
      this.fbUrl = app.fbUrl + '/projects/' + projectId;
    }
  });
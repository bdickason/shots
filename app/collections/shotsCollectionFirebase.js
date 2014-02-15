/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ShotModel,
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function(models, options) {
        this.fbUrl = app.fbUrl + '/shots/' + options.project;
    }
  });
/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ShotModel,
    firebase: new Firebase(app.fbUrl + '/shots/'),
    initialize: function() {
    }
  });
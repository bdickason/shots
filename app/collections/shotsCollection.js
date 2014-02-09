/* Shots Collection - An ordered list of Shots */
var ShotModelFirebase = require('../models/shotModelFirebase.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ShotModelFirebase,
    initialize: function() {
      console.log(this);
    }
  });
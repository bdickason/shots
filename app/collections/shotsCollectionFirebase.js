/* Shots Collection - An ordered list of Shots */
var ShotModelFirebase = require('../models/shotModelFirebase.js');

module.exports = Backbone.Collection.extend({
    model: ShotModelFirebase,
    firebase: function() {
      return(new Firebase(this.fbUrl));
    },
    initialize: function() {
      this.fbUrl = app.fbUrl + '/shots';
    }
  });
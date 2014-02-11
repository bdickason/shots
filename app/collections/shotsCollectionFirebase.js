/* Shots Collection - An ordered list of Shots */
var ShotModelFirebase = require('../models/shotModelFirebase.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ShotModelFirebase,
    firebase: new Firebase(app.fbUrl + '/shots/'),
    initialize: function() {
    }
  });
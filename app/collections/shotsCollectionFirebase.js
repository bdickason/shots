/* Shots Collection - An ordered list of Shots */
var ShotModelFirebase = require('../models/shotModelFirebase.js');

module.exports = Backbone.Collection.extend({
    model: ShotModelFirebase,
    firebase: new Backbone.Firebase(app.fbUrl + '/shots/'),
    initialize: function() {
    }
  });
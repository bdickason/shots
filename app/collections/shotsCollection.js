/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.Collection.extend({
    model: app.ShotModel
  });

/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');
var shotModel = new ShotModel({id: 'model-edit'});

module.exports = Backbone.Collection.extend({
    model: shotModel
  });

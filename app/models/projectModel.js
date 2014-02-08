/* Project Model - data layer for a single Project */

var Shots = require('../collections/shotsCollection.js');

module.exports = Backbone.Model.extend({
  urlRoot: '/api/projects',
  initialize: function() {
  },
    defaults: {
      text: ''
    }
  });

/* Project Model - data layer for a single Project */

var Shots = require('../collections/shotsCollection.js');

module.exports = Backbone.Model.extend({
  initialize: function() {
    this.shots = new Shots({'project': this.id, url: '/projects/' + this.id});
  },
    defaults: {
      text: ''
    }
  });

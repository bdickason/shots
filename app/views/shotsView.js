/* Shots View - displays a list of shots */

var ShotModel = require('../models/shotModel.js');
var ShotView = require('../views/shotView.js');

module.exports = Backbone.View.extend({
    el: '.shots',

    initialize: function() {
      this.render();
    },

    render: function() {
      // Display each shot in a list
      _.each(shots, function(shot) {
        var shotModel = new ShotModel(shot);
        var shotView = new ShotView({model: shotModel});
        this.$el.append(shotView.el);
      }, this);

    }
  });

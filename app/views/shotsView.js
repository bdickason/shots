/* Shots View - displays a list of shots */

var ShotModel = require('../models/shotModel.js');
var ShotView = require('../views/shotView.js');

module.exports = Backbone.View.extend({
    el: '.shots',

    initialize: function() {
      this.render();
      console.log(this.$el);
      // console.log('wtf!');
      /* this.collection.bind('add', function(shot) {
        this.$el.append(new shotView({model: shot}).render().el);
      }); */
    },

    render: function() {
      // Display each shot in a list
      var view = this;  // this.collection.each overrides this to refer to current collection

      this.collection.each(function(shotModel) {
        var shotView = new ShotView({model: shotModel});
        view.$el.append(shotView.el);
      });
    }
  });

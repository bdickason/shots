/* Shots View - displays a list of shots */

var ShotModel = require('../models/shotModel.js');
var ShotView = require('../views/shotView.js');
var shotsTemplate = require('./templates/shotsTemplate.hbs');

module.exports = Backbone.View.extend({
    el: '.shots',

    template: shotsTemplate,

    initialize: function(options) {
      this.render();

      this.project = options.project;  // Save project name in case we need to add

      var view = this;
      
      this.collection.bind('add', function(shot) {
        view.$el.append(new ShotView({model: shot}).render().el);
      });
    },
    
    events: {
      'click .save': 'createShot'
    },

    createShot: function(shot) {
      if($('#text').val()) {
        var input = {
          text: $('#text').val(),
          projectId: this.project
        };

        this.collection.create(input);
        $('#text').val('');
      }
    },

    render: function() {
      // Display 'new shot' menu
      this.$el.append(this.template());

      // Display each shot in a list

      var view = this;  // this.collection.each overrides this to refer to current collection

      this.collection.each(function(shotModel) {
        var shotView = new ShotView({model: shotModel});
        view.$el.append(shotView.el);
      });
    }
  });

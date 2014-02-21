/* Shots View - displays a list of shots */

var ShotView = require('../views/shotView.js');
var shotsTemplate = require('./templates/shotsTemplate.hbs');

module.exports = Backbone.View.extend({
    tagName: 'div',
    template: shotsTemplate,

    initialize: function(options) {
      this.project = options.project;  // Save project name in case we need to add
      
      this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading

      var view = this;
      this.collection.bind('add', function(shotModel) {
        $('.shotList', view.$el).append(new ShotView({model: shotModel}, { projectId: view.project} ).render().el);
      });

      this.setElement(this.$el);
    },
    
    events: {
      'keyup .input': 'pressEnter',
      'click #createShot': 'createShot'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.createShot();
      }
      return(false);
    },

    createShot: function(shot) {
      if($('#text').val() || $('#image').val()) {
        var input = {
          text: $('#text').val(),
          image: $('#image').val(),
          timestamp: Firebase.ServerValue.TIMESTAMP
        };

        tmp = this.collection.create(input);

        $('#text').val('');
        $('#image').val('');
      }
    },

    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });

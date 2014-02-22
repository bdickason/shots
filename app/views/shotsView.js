/* Shots View - displays a list of shots */

var ShotView = require('../views/shotView.js');
var shotsTemplate = require('./templates/shotsTemplate.hbs');

module.exports = Backbone.View.extend({
    tagName: 'div',
    template: shotsTemplate,

    initialize: function(options) {
      this.project = options.project;  // Save project name in case we need to add
      
      this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event

      var view = this;
      this.collection.bind('add', function(shotModel) {
        $('.shotList', view.$el).prepend(new ShotView({model: shotModel}, { projectId: view.project} ).render().el);
      });

      this.setElement(this.$el);
    },
    
    events: {
      'keyup .input': 'pressEnter',
      'click #createShot': 'createShot',
      'click #deleteShot': 'deleteShot',
      'click img': 'toggleSize'
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
          user: app.user.get('username'),
          timestamp: Firebase.ServerValue.TIMESTAMP // Tells the server to set a createdAt timestamp
        };

        this.collection.create(input);

        $('#text').val('');
        $('#image').val('');
      }
    },

    deleteShot: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      var shotId = $(e.currentTarget).data('id');
      var shot = this.collection.get(shotId);
      var owner = shot.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(shot);
      }
    },

    toggleSize: function(e) {
      // Enlarge or shrink a shot image
      if($(e.currentTarget).hasClass('big')) {
        $(e.currentTarget).removeClass('big');
      }
      else {
        $(e.currentTarget).addClass('big');
      }
    },
    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });

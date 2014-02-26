/* Comments View - displays a list of comments */

var commentsTemplate = require('./commentsTemplate.hbs');

module.exports = Backbone.View.extend({
    tagName: 'div',
    template: commentsTemplate,

    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);    // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event
      this.listenTo(this.collection, 'add', this.render);     // When a shot is added, the collection doesn't sync

      this.setElement(this.$el);
    },
    
    events: {
      'keyup .input': 'pressEnter',
      'click #createComment': 'createComment',
      'click #deleteComment': 'deleteComment'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.createComment();
      }
      return(false);
    },

    createComment: function(comment) {
      textarea = this.$el.find('#text.comment');
      if(textarea.val()) {
        var input = {
          text: textarea.val(),
          user: app.user.get('username'),
          timestamp: Firebase.ServerValue.TIMESTAMP // Tells the server to set a createdAt timestamp
        };

        this.collection.create(input);
        mixpanel.track('Comment', input);

        textarea.val('');
      }
    },

    deleteComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      var shotId = $(e.currentTarget).data('id');
      var shot = this.collection.get(shotId);
      var owner = shot.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(shot);
      }
    },
    
    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });

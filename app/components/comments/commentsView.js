/* Comments View - displays a list of comments */

var CommentView = require('./commentView.js');
var commentsTemplate = require('./commentsTemplate.hbs');


module.exports = Backbone.View.extend({
    tagName: 'div',
    template: commentsTemplate,

    initialize: function() {
      this.id = this.collection.id;  // Shot ID
      this.projectId = this.collection.projectId;

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
      if(app.user.get('loggedIn')) {
        textarea = this.$el.find('#text.comment');
        if(textarea.val()) {
          var input = {
            text: textarea.val(),
            user: app.user.get('username'),
            timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
          };

          this.collection.create(input);
          mixpanel.track('Comment', input);

          textarea.val('');
        }
      } else {
        this.showError('Sorry, you must be logged in');
      }
    },

    // Temporary fix, this should be moved back to commentView.js
    deleteComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      var commentId = $(e.currentTarget).data('id');
      var comment = this.collection.get(commentId);
      var owner = comment.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(comment);
      }
    },

    showError: function(message) {
      var error = this.$el.find('#commentsError');
      error.text(message);
      error.show();
    },

    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));

      // Iterate through each comment model and add it to our list of comments
      var self = this;
      this.collection.each(function(comment) {
        var commentView = new CommentView({model: comment, projectId: self.projectId });
        this.$el.find('ul.comments').append(commentView.render().el);
      }, this);

      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });

/* Comments View - displays a list of comments */

var CommentView = require('../show/commentView.js');
var commentListTemplate = require('./commentListTemplate.hbs');


module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'div',
    template: commentListTemplate,

    itemView: CommentView,
    itemViewContainer: '.comments',

    initialize: function() {
      this.id = this.collection.id;  // Shot ID
      this.projectId = this.collection.projectId;

      this.listenTo(this.collection, 'sync', this.render);    // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event
      this.listenTo(this.collection, 'add', this.render);     // When a shot is added, the collection doesn't sync
  
      // this.bindTo(App.vent, "some:event", this.someCallback, this);
      // this.setElement(this.$el);
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

    // Hack - this should be moved back to commentView.js
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

    onRender: function() {
      // Hack - events will not fire unless we delegateEvente()
      this.delegateEvents();
    }
  });

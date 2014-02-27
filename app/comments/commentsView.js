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
      'click #deleteComment': 'deleteComment',
      'click #editComment': 'editComment',
      'click #cancelEdit': 'cancelEdit',
      'click #save': 'saveComment'
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
      var commentId = $(e.currentTarget).data('id');
      var comment = this.collection.get(commentId);
      var owner = comment.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(shot);
      }
    },

    editComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      // Determine what comment we're editing
      var commentId = $(e.currentTarget).data('id');
      var comment = this.collection.get(commentId);
      var owner = comment.get('user');

      if(app.user.get('username') == owner) {
        var commentElement = this.$el.find('li#' + commentId);  // Locate parent <li> for this comment

        // Replace current edit button with cancel link
        $(e.currentTarget).hide();  // Hide edit button      

        cancelButton = commentElement.find('#cancelEdit').show();
        // cancelButton.on('click', _.bind(this.cancelEdit, this));

        saveButton = commentElement.find('#save').show();
        
        // Turn text into textarea
        commentText = commentElement.children('#text');
        commentText.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
        commentText.focus();

      }
    },

    cancelEdit: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      
      // Determine what comment we're editing
      var commentId = $(e.currentTarget).data('id');
      var comment = this.collection.get(commentId);
      var owner = comment.get('user');

      if(app.user.get('username') == owner) {

        var commentElement = this.$el.find('li#' + commentId);  // Locate parent <li> for this comment
        
        // Replace cancel link with edit button
        $(e.currentTarget).hide();
        editButton = commentElement.find('#editComment').show();

        // reset text to normal
        commentText = commentElement.children('#text');
        commentText.attr('contenEditable', 'false');
        commentText.blur();

        this.render();  // commentText does not update unless we re-render
      }
    },

    saveComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      
      // Determine what comment we're editing
      var commentId = $(e.currentTarget).data('id');
      var comment = this.collection.get(commentId);
      
      var owner = comment.get('user');

      if(app.user.get('username') == owner) {
        // Locate parent <li> for this comment
        var commentElement = this.$el.find('li#' + commentId);
        
        // Replace cancel link with edit button
        $(e.currentTarget).hide();
        editButton = commentElement.find('#editComment').show();

        // reset text to normal
        commentText = commentElement.children('#text');
        commentText.attr('contentEditable', 'false');
        commentText.blur();

        // Save next text value
        comment.set('text', commentText.text());
      }
    },
    
    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });

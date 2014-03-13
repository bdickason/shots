/* Comments View - displays a list of comments */

var commentTemplate = require('./commentTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    template: commentTemplate,

    initialize: function() {
      this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
      this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere

      this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render

      this.setElement(this.$el);
    },
    
    events: {
      'keyup #commentText': 'pressEnter',
      // 'click #deleteComment': 'deleteComment',
      'click #editComment': 'editComment',
      'click #cancelCommentEdit': 'cancelEdit',
      'click #saveComment': 'saveComment'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.saveComment();
      }
      return(false);
    },

    /* Cannot call this.model.destroy for some reason o_O
       Tentatively moving delete back to commentsView.js

    deleteComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        console.log('got here');
        this.model.destroy();
      }
    }, */

    editComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      // Determine what comment we're editing
      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        // Replace current edit button with cancel link
        $(e.currentTarget).hide();  // Hide edit button      

        cancelButton = this.$el.find('#cancelCommentEdit').show();
        // cancelButton.on('click', _.bind(this.cancelEdit, this));

        saveButton = this.$el.find('#saveComment').show();
        
        // Turn text into textarea
        commentText = this.$el.find('#commentText');
        commentText.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
        commentText.focus();
      }
    },

    cancelEdit: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      
      var owner = this.model.get('user');

      console.log('got here');
      if(app.user.get('username') == owner) {
        // Replace cancel link with edit button
        $(e.currentTarget).hide();
        editButton = this.$el.find('#editComment').show();

        // reset text to normal
        commentText = this.$el.find('#commentText');
        commentText.attr('contenEditable', 'false');
        commentText.blur();

        this.render();  // commentText does not update unless we re-render
      }
    },

    saveComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      
      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        // Replace cancel link with edit button
        $(e.currentTarget).hide();  // Hide save button
        cancelButton = this.$el.find('#cancelCommentEdit').hide();
        editButton = this.$el.find('#editComment').show();


        // reset text to normal
        commentText = this.$el.find('#commentText');
        commentText.attr('contentEditable', 'false');
        commentText.blur();

        // Save next text value
        this.model.set('text', commentText.text());
      }
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      
      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });

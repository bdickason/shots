/* Shot View - displays a shot module embedded inside another page */

var shotShowTemplate = require('./shotShowTemplate.hbs');

var Comments = require('../../comments/comments.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: shotShowTemplate,
  className: 'shot single',
  id: function() {
    // Sets the id= of our <li>
    return(this.model.get('id'));
  },

  initialize: function(options) {
    // Model is passed in by Controller   
    this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
    this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere
   
    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    this.comments = new Comments.List({shotId: this.model.get('id'), projectId: this.model.get('projectId')});
  },

  events: {
    'click .shotlink': 'gotoShot',
    'click #editShot': 'editShot',
    'click #cancelShotEdit': 'cancelEdit',
    'click #saveShot': 'saveShot',
    'click #deleteShot': 'deleteShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    // Render comments
    this.$el.find('.comments').html(this.comments.view.render().el);
    
    // this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
    
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('projectId') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});
  },

  editShot: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {
      // Replace current edit button with cancel link
      $(e.currentTarget).hide();  // Hide edit button   

      cancelButton = this.$el.children('p').children('#cancelShotEdit').show();
      // cancelButton.on('click', _.bind(this.cancelEdit, this));

      saveButton = this.$el.children('p').children('#saveShot').show();

      // Turn image into textarea
      shotImage = this.$el.children('#shotImage');
      shotImage.attr('contentEditable', 'true');

      // Turn text into textarea
      shotText = this.$el.children('#shotText');
      shotText.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
      shotText.focus();
    }
  },

  cancelEdit: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor
    
    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {
      // Replace cancel link with edit button
      $(e.currentTarget).hide();
      saveButton = this.$el.children('p').children('#saveShot').hide();
      editButton = this.$el.children('p').children('#editShot').show();

      // reset image to normal
      shotImage = this.$el.children('#shotImage');
      shotImage.attr('contentEditable', 'false');

      // reset text to normal
      shotText = this.$el.children('#shotText');
      shotText.attr('contenEditable', 'false');
      shotText.blur();

      this.render();  // commentText does not update unless we re-render
    }
  },

  saveShot: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {

      // Return interface to normal
      $(e.currentTarget).hide();  // Hide save button
      cancelButton = this.$el.children('p').children('#cancelShotEdit').hide();
      editButton = this.$el.children('p').children('#editShot').show();

      // image is no longer editable
      shotImage = this.$el.children('#shotImage');
      shotImage.attr('contentEditable', 'false');
      shotImage.blur();
      
      // text is no longer editable
      shotText = this.$el.children('#shotText');
      shotText.attr('contentEditable', 'false');
      shotText.blur();

      // Save next text value
      this.model.set('image', shotImage.attr('src'));
      this.model.set('text', shotText.text());
    }
  },

  deleteShot: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    // Store projectId to redirect user after delete
    var projectId = this.model.get('projectId');

    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {
      this.model.destroy(
      {
        success: function(model) {
          // Successfully deleted model, now redirect to the project
          var route = '/' + projectId;

          app.router.navigate(route, {trigger: true});
      }
      });
    }
  }
});

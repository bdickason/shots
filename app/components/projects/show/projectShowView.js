/* Project View - displays a single projects */

var projectTemplate = require('./projectTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    // Model must be passed in by controller
    this.listenTo(this.model, 'sync', this.render); // Without this, the model doesn't render after it completes loading

    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
  },

  events: {
    'click #editProject': 'editProject',
    'click #cancelProjectEdit': 'cancelEdit',
    'click #saveProject': 'saveProject'
  },

 editProject: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {
      // Replace current edit button with cancel link
      $(e.currentTarget).hide();  // Hide edit button

      var settings = this.$el.children('p.projectSettings');

      settings.children('#cancelProjectEdit').show();

      saveButton = settings.children('#saveProject').show();

      // Turn name into editable field
      projectName = this.$el.children('h1');
      projectName.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
      projectName.focus();
    }
  },

  cancelEdit: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor
    
    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {
      // Replace cancel link with edit button
      $(e.currentTarget).hide();

      var settings = this.$el.children('p.projectSettings');

      saveButton = settings.children('#saveProject').hide();
      editButton = settings.children('#editProject').show();

      // reset name to normal
      projectName = this.$el.children('h1');
      projectName.attr('contenEditable', 'false');
      projectName.blur();

      this.render();  // projectName does not update unless we re-render
    }
  },

  saveProject: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {

      // Return interface to normal
      $(e.currentTarget).hide();  // Hide save button

      var settings = this.$el.children('p.projectSettings');

      cancelButton = settings.children('#cancelProjectEdit').hide();
      editButton = settings.children('#editProject').show();

      // name is no longer editable
      projectName = this.$el.children('h1');
      projectName.attr('contentEditable', 'false');
      projectName.blur();

      // Save new name
      this.model.set('id', projectName.text());

      var modelId = this.model.get('id');
      route = '/' + modelId;

      // Redirect user to new url
      app.router.navigate(route, { trigger: true });
    }
  }
});

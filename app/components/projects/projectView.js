/* Project View - displays a single projects */

var ProjectModelFirebase = require('./projectModelFirebase.js');

var projectTemplate = require('./projectTemplate.hbs');

var ShotsCollectionFirebase = require('../shots/shotsCollectionFirebase.js');

var ShotsView = require('../shots/shotsView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    if(!this.model) {
      this.model = new ProjectModelFirebase({id: this.id});
    }
  
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    this.shotsCollectionFirebase = new ShotsCollectionFirebase([], {project: this.model.get('id')});
    this.shotsView = new ShotsView({ collection: this.shotsCollectionFirebase, project: this.model.get('id')});
  },

  events: {
    'click #editProject': 'editProject',
    'click #cancelProjectEdit': 'cancelEdit',
    'click #saveProject': 'saveProject'
  },

  render: function() {
    console.log(this.model.toJSON());
    this.$el.html(this.template(this.model.toJSON()));

    shotDiv = this.$el.find('div.shots');
    shotDiv.html(this.shotsView.render().el);

    this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js    
    return this;
  },

 editProject: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {
      // Replace current edit button with cancel link
      $(e.currentTarget).hide();  // Hide edit button

      var settings = this.$el.children('p .projectSettings');
      console.log(settings);

      settings.children('#cancelProjectEdit').show();

      saveButton = settings.children('#saveProject').show();

      // Turn name into textarea
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
      saveButton = this.$el.children('p').children('#saveProject').hide();
      editButton = this.$el.children('p').children('#editProject').show();

      // reset image to normal
      projectImage = this.$el.children('#projectImage');
      projectImage.attr('contentEditable', 'false');

      // reset text to normal
      projectText = this.$el.children('#projectText');
      projectText.attr('contenEditable', 'false');
      projectText.blur();

      this.render();  // commentText does not update unless we re-render
    }
  },

  saveProject: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {

      // Return interface to normal
      $(e.currentTarget).hide();  // Hide save button
      cancelButton = this.$el.children('p').children('#cancelProjectEdit').hide();
      editButton = this.$el.children('p').children('#editProject').show();

      // image is no longer editable
      projectImage = this.$el.children('#projectImage');
      projectImage.attr('contentEditable', 'false');
      projectImage.blur();
      
      // text is no longer editable
      projectText = this.$el.children('#projectText');
      projectText.attr('contentEditable', 'false');
      projectText.blur();

      // Save next text value
      this.model.set('image', projectImage.attr('src'));
      this.model.set('text', projectText.text());
    }
  }
});

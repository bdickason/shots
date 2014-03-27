/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./projectListTemplate.hbs');

var ProjectCardView = require('../show/projectCardView.js');

module.exports = Backbone.Marionette.CompositeView.extend({
  tagName: 'div',
  template: projectsTemplate,
  itemView: ProjectCardView,
  itemViewContainer: 'ul.projects',

  initialize: function(options) {
    this.id = options.id;

    // Collection must be passed in by Controller
    this.listenTo(this.collection, 'sync', this.render);  // Without this, the collection doesn't render after it completes loading
    this.listenTo(this.collection, 'remove', this.render);   // Collection doesn't call sync when we add a new model.  
  },

  events: {
    'click .project a': 'gotoProject',
    'click #newProject': 'toggleNewProject',
    'keyup input': 'pressEnter',
    'click #createProject': 'createProject'
  },

  gotoProject: function(e) {
    // Navigate to a specific project
    e.preventDefault(); // Have to disable the default behavior of the anchor

    projectId = e.target.id;
    route = projectId;
    app.router.navigate(route, {trigger: true});
  },

  toggleNewProject: function() {
    // Displays/hides the 'New Shot' interface
    if(app.user.get('loggedIn')) {
      var newProjectView = this.$el.find('.createSection');
      newProjectView.toggle();
    }
  },

  pressEnter: function(e) {
    // Submit form when user presses enter
    if(e.which == 13 && $('#name').val()) {
      this.createProject(e);
    }
    return(false);
  },

  createProject: function(project) {
    if(app.user.get('loggedIn')) {
      var name = this.$el.find('#name');
      
      if(name.val()) {
        var input = {
          id: name.val(),
          user: app.user.get('username'),
          timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
        };

        this.collection.add(input);
        this.collection.trigger('sync');  // HACK - Marionette View normally places new models at the end of the collection

        mixpanel.track('Create Project', input);

        name.val('');

        this.trigger('click #newProject');
      }
    } else {
      this.showError('Sorry, you must be logged in');
    }
  },

  showError: function(message) {
    var error = this.$el.find('#projectsError');
    error.text(message);
    error.show();
  },

  itemViewOptions: function(model, index) {
    // Determine selected item
    if(this.id) {
      if(model.get('id') == this.id) {
        return({ selected: true });
      }
    }
    return(null);
  }
});

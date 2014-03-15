/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./projectListTemplate.hbs');

var ProjectsCollectionFirebase = require('../projectsCollectionFirebase.js');

var ProjectCardView = require('../show/projectCardView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectsTemplate,

  initialize: function() {
    if(!this.collection) {
      this.collection = new ProjectsCollectionFirebase();
    }

    this.listenTo(this.collection, 'sync', this.render);  // Without this, the collection doesn't render after it completes loading
    this.listenTo(this.collection, 'add', this.render);   // Collection doesn't call sync when we add a new model.
    this.listenTo(this.collection, 'remove', this.render);   // Collection doesn't call sync when we add a new model.
  },

  events: {
    'click .project a': 'gotoProject',
    'click #createProject': 'createProject'
  },

  render: function() {
    this.$el.html(this.template(this.collection.toJSON()));

    // Iterate through each project model and add it to our list of comments
      var self = this;
      this.collection.each(function(project) {
        var projectCardView = new ProjectCardView({model: project });
        this.$el.find('ul.projects').append(projectCardView.render().el);
      }, this);
    return this;
  },

  gotoProject: function(e) {
    // Navigate to a specific project
    e.preventDefault(); // Have to disable the default behavior of the anchor

    projectId = e.target.id;
    route = projectId;
    app.router.navigate(route, {trigger: true});
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

        mixpanel.track('Create Project', input);

        name.val('');
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
});

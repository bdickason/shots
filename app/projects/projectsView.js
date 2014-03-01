/* Projects View - displays all projects active within the system */

var ProjectsCollectionFirebase = require('./projectsCollectionFirebase.js');

var projectsTemplate = require('./projectsTemplate.hbs');

var ProjectView = require('./projectView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectsTemplate,

  initialize: function() {
    this.collection = new ProjectsCollectionFirebase();
    this.listenTo(this.collection, 'sync', this.render);  // Without this, the collection doesn't render after it completes loading
    this.listenTo(this.collection, 'add', this.render);   // Collection doesn't call sync when we add a new model.
    this.listenTo(this.collection, 'remove', this.render);   // Collection doesn't call sync when we add a new model.
  },

  events: {
    'click .project a': 'gotoProject',
    'click .save': 'createProject'
  },

  render: function() {
    this.$el.html(this.template(this.collection.toJSON()));
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
    if($('#name').val()) {
      var input = {
        id: $('#name').val()
      };

      this.collection.add(input);

      mixpanel.track('Create Project', input);

      $('#name').val('');
    }
  }
});

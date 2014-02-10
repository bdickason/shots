/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./templates/projectsTemplate.hbs');

var ProjectView = require('../views/projectView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectsTemplate,

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();

    var view = this;
    this.collection.bind('add', function(project) {
      view.$('.projects').append(new ProjectView({model: project}).render().el);
    });
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

      this.collection.create(input);

      $('#name').val('');
    }
  }
});

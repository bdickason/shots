/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./templates/projectsTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectsTemplate,

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();
  },

  events: {
    'click .project a': 'gotoProject'
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
  }
});

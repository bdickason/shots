/* projectNav View - Renders a sub-nav for a specific project */

var projectNavTemplate = require('./templates/projectNavTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectNavTemplate,

  initialize: function() {
    this.render();  // Data will not change so we only need to render once
  },

  events: {
    'click #project': 'gotoProject'
  },

  render: function() {
    this.$el.html(this.template({ id: this.id })); // Nav has no collection associated with it, so just render the tepmlate
    return this;
  },

  gotoProject: function(e) {
    // Navigate to the Project page
    
    e.preventDefault(); // Have to disable the default behavior of the anchor

    route = this.id;
    app.router.navigate(route, {trigger: true});

    app.utils.close(this);
  }
});

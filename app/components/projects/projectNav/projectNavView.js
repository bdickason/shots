/* projectNav View - Renders a sub-nav for a specific project */

var projectNavTemplate = require('./projectNavTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: projectNavTemplate,

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
  }
});

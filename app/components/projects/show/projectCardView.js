/* Project Card View - displays a snapshot of a single projects */

var projectCardTemplate = require('./projectCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'project',
  template: projectCardTemplate,
  id: function() {
    return(this.model.get('id'));
  },
  initialize: function(options) {
    if(options.selected) {
      this.selected = true;
      this.$el.addClass('selected');
    }
  }
});

/* Project Card View - displays a snapshot of a single projects */

var projectCardTemplate = require('./projectCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',
  template: projectCardTemplate
});

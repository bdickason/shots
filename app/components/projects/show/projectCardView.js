/* Project Card View - displays a snapshot of a single projects */

var ProjectModelFirebase = require('../projectModelFirebase.js');

var projectCardTemplate = require('./projectCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: projectCardTemplate,

  initialize: function() {
    if(!this.model) {
      this.model = new ProjectModelFirebase({id: this.id});
    }
  }
});

/* Project View - displays a single projects */

var projectTemplate = require('./templates/projectTemplate.hbs');

var ShotsCollectionFirebase = require('../collections/shotsCollectionFirebase.js');

var ShotsView = require('../views/shotsView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    shotsCollectionFirebase = new ShotsCollectionFirebase([], {project: this.model.get('id')});
    shotsView = new ShotsView({ collection: shotsCollectionFirebase, project: this.model.get('id') });

    return this;
  }
});

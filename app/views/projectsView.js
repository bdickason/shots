/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./templates/projectsTemplate.hbs');

module.exports = Backbone.View.extend({
  el: '#container',

  template: projectsTemplate,

  initialize: function() {
    this.collection.bind('reset', this.render, this); // Without this, the collection doesn't render after it completes loading
    this.render();
  },

  render: function() {
    console.log(this.collection.toJSON());
    this.$el.html(this.template(this.collection.toJSON()));
    return this;
  }
});

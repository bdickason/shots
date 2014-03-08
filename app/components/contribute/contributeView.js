/* Contribute View - For anyone who wants to contribute! */

var contributeTemplate = require('./contributeTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: contributeTemplate,

  initialize: function() {
    this.render();
  },

  events: {
  },

  render: function() {
    this.$el.html(this.template()); // No models or collections here ^__^
    return this;
  },
});

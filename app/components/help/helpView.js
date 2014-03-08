/* Help View - For anyone that needs help, gets lost, etc. */

var helpTemplate = require('./helpTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: helpTemplate,

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

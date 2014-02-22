/* Nav View - Renders the navigation */

var navTemplate = require('./templates/navTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: navTemplate,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();
  },

  events: {
    'click #home': 'gotoHome',
    'click #login': 'login',
    'click #logout': 'logout'
  },

  render: function() {
    console.log(this.model.toJSON());
    this.$el.html(this.template(this.model.toJSON())); // Nav has no collection associated with it, so just render the tepmlate
    return this;
  },

  login: function(e) {
    // Relies on Firebase Simple Login
    this.model.login('twitter');
  },

  logout: function(e) {
    this.model.logout();
  }
});

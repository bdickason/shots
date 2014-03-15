/* Nav View - Renders the navigation */

var navTemplate = require('./navTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: navTemplate,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render); // Without this, the collection doesn't render after it completes loading
  },

  events: {
    'click #home': 'home',
    'click #login': 'login',
    'click #logout': 'logout',
    'click #contribute': 'contribute',
    'click #help': 'help'
  },

  home: function(e) {
    // Send user home
    e.preventDefault();
    app.router.navigate('', {trigger: true });
  },

  login: function(e) {
    e.preventDefault();
    // Relies on Firebase Simple Login
    this.model.login('twitter');
  },

  logout: function(e) {
    e.preventDefault();
    this.model.logout();
  },

  contribute: function(e) {
    e.preventDefault();
    app.router.navigate('contribute', {trigger: true});
  },

  help: function(e) {
    e.preventDefault();
    app.router.navigate('help', {trigger: true});
  }
});

/* Nav View - Renders the navigation */

var navTemplate = require('./navTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: navTemplate,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();
  },

  events: {
    'click #home': 'home',
    'click #login': 'login',
    'click #logout': 'logout',
    'click #contribute': 'contribute',
    'click #help': 'help'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON())); // Nav has no collection associated with it, so just render the tepmlate
    return this;
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

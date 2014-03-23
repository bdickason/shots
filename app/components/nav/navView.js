/* Nav View - Renders the navigation */

var navTemplate = require('./navTemplate.hbs');

var Users = require('../users/users.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: navTemplate,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render); // Without this, the collection doesn't render after it completes loading
    this.listenTo(app.user, 'change', this.render);
  },

  onRender: function() {
    // Render user card
    this.user = new Users.ShowCard({id: app.user.get('username') });
    this.$el.find('.user').html(this.user.view.render().el);
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

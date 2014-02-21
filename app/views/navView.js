/* Nav View - Renders the navigation */

var navTemplate = require('./templates/navTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: navTemplate,

  initialize: function() {
    this.render();
  },

  events: {
    'click #home': 'gotoHome',
    'click #login': 'login'
  },

  render: function() {
    this.$el.html(this.template(app.user)); // Nav has no collection associated with it, so just render the tepmlate
    return this;
  },

  login: function(e) {
    app.auth.login('twitter');
  },

  gotoHome: function(e) {
    // Navigate to the homepage
    // Can't figure out how to pass an empty route to Backbone to get it to the homepage
    /*
    e.preventDefault(); // Have to disable the default behavior of the anchor

    route = " ";
    console.log(app.router);
    app.router.navigate(route, {trigger: true}); */
  }
});

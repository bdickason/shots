/* Main app js file */

window.onload = function(){
  var AppView = Backbone.View.extend({
    el: '#container',

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html("Welcome to Shots!");
    }
  });

  var appView = new AppView();
};
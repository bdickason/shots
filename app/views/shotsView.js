/* Shots View - handles logic and rendering of shots */
module.exports = Backbone.View.extend({
    el: '#container',

    initialize: function() {
      this.render();
    },

    render: function() { 
      this.$el.html("Welcome to Shots!");
    }
  });

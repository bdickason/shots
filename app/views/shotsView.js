/* Shots View - displays a list of shots */

var ShotView = require('../views/shotView.js');
var shotsTemplate = require('./templates/shotsTemplate.hbs');

module.exports = Backbone.View.extend({
    tagName: 'ul',
    template: shotsTemplate,

    initialize: function(options) {
      this.project = options.project;  // Save project name in case we need to add

      /* this.collection.bind('add', function(shot) {
        view.$el.append(new ShotView({model: shot}, { projectId: view.project }).render().el);
      }); */
      
      this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'all', app.utils.debug);

      var view = this;
      this.collection.bind('add', function(shotModel) {
        $('.shotList', view.$el).append(new ShotView({model: shotModel}, { projectId: view.project} ).render().el);
      });
    },
    
    events: {
      'click .save': 'createShot'
    },

    createShot: function(shot) {
      if($('#text').val()) {
        var input = {
          id: $('#text').val()
        };

        tmp = this.collection.create(input);

        $('#text').val('');
      }
    },

    render: function() {
      console.log(this.collection.toJSON());
      this.$el.html(this.template(this.collection.toJSON()));
      return(this);
    }
  });

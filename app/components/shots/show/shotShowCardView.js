/* Shot View - displays a shot module embedded inside another page */

var shotShowCardTemplate = require('./shotShowCardTemplate.hbs');

var Comments = require('../../comments/comments.js');
var Users = require('../../users/users.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: shotShowCardTemplate,
  id: function() {
    // Sets the id= attribute of our <li>
    return(this.model.get('id'));
  },
  className: 'shot',

  initialize: function(options) {
    // Model is passed in via controller   
    this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
    this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere

    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    // Setup user card to show avatar
    this.users = new Users.ShowCard({id: this.model.get('user')});

    // Setup comment card to show # of comments
    this.comments = new Comments.ListCard({shotId: this.model.get('id'), projectId: this.model.get('projectId')});
  },

  events: {
    'click .shotlink': 'gotoShot',
  },

  onRender: function() {
    // Render user card
    this.$el.find('.shotCreator').html(this.users.view.render().el);

    // Render comments
    this.$el.find('.shotComments').html(this.comments.view.render().el);

  },
  // render: function() {
  //   this.$el.html(this.template(this.model.toJSON()));

    
  //   this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
    
  //   return this;
  // },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('projectId') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});
  }
});

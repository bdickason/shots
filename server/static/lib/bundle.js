(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Main app js file */

Backbone.$ = window.$;

var userModel = require('./components/users/loginModel.js');

app = new Backbone.Marionette.Application();


app.on('initialize:after', function() {
    // Configure the app
    
    // Regions define areas in the template (/server/views/client.handlebars) that we'll insert content into
    app.addRegions({
        header: 'nav#primary',      // Used for main nav
        subhead: "nav#secondary",    // Used for secondary nav
        content: 'section#content',    // Used for main content
        footer: 'footer'       // Stuff everything else here?
    });

    // Generic utility functions used throughout the app
    app.utils = require('./utils.js');

    // Firebase URL for accessing data
    app.fbUrl = 'https://shots.firebaseio.com';

    // User authentication (via Firebase)
    app.user = new userModel(); // Attempts to authenticate the current user

    // Setup router
    var Routes = require('./routes.js');

    app.router = new Routes(); // Routes control the app and start everything up, depending on location

    // Starting the router allows us to accept url's (defined below in app.router)
    Backbone.history.start({pushState: true});
});

window.onload = function(){
    app.start();    // Starts the app
};


},{"./components/users/loginModel.js":36,"./routes.js":37,"./utils.js":38}],2:[function(require,module,exports){
/* Comment Model - data layer for a single Comment */

var utils = require('../../utils.js');

module.exports = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
      text: ''
    },
    toJSON: function() {
      var output = utils.formatTime(this);  // Generate human-readable timestamp
      
      if(this.get('user') === app.user.get('username')) {
        // User owns this comment
        output.owner = true;
      }
      
      return(output);         // Generate human-readable timestamp
    }
});

},{"../../utils.js":38}],3:[function(require,module,exports){
/* Comments Collection - An ordered list of Comments */
var CommentModel = require('./commentModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: CommentModel,
    comparator: function(model) {
      // Sorts model by timestamp, newest first
      return(-model.get('timestamp'));
    },
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function(models, options) {
        this.fbUrl = app.fbUrl + '/comments/' + options.projectId + '/' + options.shotId;
    }
  });
},{"./commentModel.js":2}],4:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "    <label class=\"shotComments\">"
    + escapeExpression(((stack1 = (depth0 && depth0.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression((helper = helpers.pluralize || (depth0 && depth0.pluralize),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.length), "Comment", "Comments", options) : helperMissing.call(depth0, "pluralize", (depth0 && depth0.length), "Comment", "Comments", options)))
    + "</label>";
  return buffer;
  });

},{"hbsfy/runtime":46}],5:[function(require,module,exports){
/* Comments View - displays a list of comments */

var commentListCardTemplate = require('./commentListCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    template: commentListCardTemplate,

    initialize: function() {
      this.id = this.collection.id;  // Shot ID
      this.projectId = this.collection.projectId;

      this.listenTo(this.collection, 'sync', this.render);    // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a comment is deleted, server does not send a sync event
      this.listenTo(this.collection, 'add', this.render);     // When a comment is added, the collection doesn't sync
    },

    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));

      return(this);
    }
  });

},{"./commentListCardTemplate.hbs":4}],6:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "    <label><h3>"
    + escapeExpression(((stack1 = (depth0 && depth0.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression((helper = helpers.pluralize || (depth0 && depth0.pluralize),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.length), "Comment", "Comments", options) : helperMissing.call(depth0, "pluralize", (depth0 && depth0.length), "Comment", "Comments", options)))
    + "</h3></label>\n    <textarea id=\"text\" type=\"text\" class=\"comment\" placeholder=\"Enter your comment\" /><br />\n    <button id=\"createComment\">save</button>\n    <label id=\"commentsError\" class=\"error\"></label>\n    <ul class=\"comments\">\n    </ul>";
  return buffer;
  });

},{"hbsfy/runtime":46}],7:[function(require,module,exports){
/* Comments View - displays a list of comments */

var CommentView = require('../show/commentView.js');
var commentListTemplate = require('./commentListTemplate.hbs');


module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'div',
    template: commentListTemplate,

    itemView: CommentView,
    itemViewContainer: '.comments', // Automatically inserts comments here

    initialize: function() {
      this.id = this.collection.id;  // Shot ID
      this.projectId = this.collection.projectId;

      this.listenTo(this.collection, 'sync', this.render);    // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event
    },

    events: {
      'keyup .input': 'pressEnter',
      'click #createComment': 'createComment',
      'click #deleteComment': 'deleteComment'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.createComment();
      }
      return(false);
    },

    createComment: function(comment) {
      if(app.user.get('loggedIn')) {
        textarea = this.$el.find('#text.comment');
        if(textarea.val()) {
          var input = {
            text: textarea.val(),
            user: app.user.get('username'),
            timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
          };

          this.collection.create(input);
          mixpanel.track('Comment', input);

          textarea.val('');
        }
      } else {
        this.showError('Sorry, you must be logged in');
      }
    },

    // Hack - this should be moved back to commentView.js
    deleteComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      var commentId = $(e.currentTarget).data('id');
      var comment = this.collection.get(commentId);
      var owner = comment.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(comment);
      }
    },

    showError: function(message) {
      var error = this.$el.find('#commentsError');
      error.text(message);
      error.show();
    },

    onRender: function() {
      // Hack - events will not fire unless we delegateEvente()
      this.delegateEvents();
    }
  });

},{"../show/commentView.js":9,"./commentListTemplate.hbs":6}],8:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <p class=\"commentSettings\">\n        <a href=\"#edit\" id=\"editComment\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">edit</a> \n        <a href=\"#cancel\" id=\"cancelCommentEdit\" style=\"display: none\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">cancel</a> \n        <button id=\"saveComment\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Save</button>\n        <a href=\"#delete\" id=\"deleteComment\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">delete</a>\n      </p>\n    ";
  return buffer;
  }

  buffer += "<li id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"comment\">\n    Posted ";
  if (helper = helpers.time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " by ";
  if (helper = helpers.user) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<br />\n    <p id=\"commentText\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.owner), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</li>";
  return buffer;
  });

},{"hbsfy/runtime":46}],9:[function(require,module,exports){
/* Comments View - displays a list of comments */

var commentTemplate = require('./commentTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    template: commentTemplate,

    initialize: function() {
      this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
      this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere

      this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render

      this.setElement(this.$el);
    },
    
    events: {
      'keyup #commentText': 'pressEnter',
      // 'click #deleteComment': 'deleteComment',
      'click #editComment': 'editComment',
      'click #cancelCommentEdit': 'cancelEdit',
      'click #saveComment': 'saveComment'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.saveComment();
      }
      return(false);
    },

    /* Cannot call this.model.destroy for some reason o_O
       Tentatively moving delete back to commentsView.js

    deleteComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        console.log('got here');
        this.model.destroy();
      }
    }, */

    editComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor

      // Determine what comment we're editing
      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        // Replace current edit button with cancel link
        $(e.currentTarget).hide();  // Hide edit button      

        cancelButton = this.$el.find('#cancelCommentEdit').show();
        // cancelButton.on('click', _.bind(this.cancelEdit, this));

        saveButton = this.$el.find('#saveComment').show();
        
        // Turn text into textarea
        commentText = this.$el.find('#commentText');
        commentText.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
        commentText.focus();
      }
    },

    cancelEdit: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      
      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        // Replace cancel link with edit button
        $(e.currentTarget).hide();
        editButton = this.$el.find('#editComment').show();

        // reset text to normal
        commentText = this.$el.find('#commentText');
        commentText.attr('contenEditable', 'false');
        commentText.blur();

        this.render();  // commentText does not update unless we re-render
      }
    },

    saveComment: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      
      var owner = this.model.get('user');

      if(app.user.get('username') == owner) {
        // Replace cancel link with edit button
        $(e.currentTarget).hide();  // Hide save button
        cancelButton = this.$el.find('#cancelCommentEdit').hide();
        editButton = this.$el.find('#editComment').show();


        // reset text to normal
        commentText = this.$el.find('#commentText');
        commentText.attr('contentEditable', 'false');
        commentText.blur();

        // Save next text value
        this.model.set('text', commentText.text());
      }
    }
  });

},{"./commentTemplate.hbs":8}],10:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Contribute!</h1>\n  \n<h2>Designer</h2>\n\n<a href=\"http://discuss.braddickason.com\" target=\"_blank\">Tell us what you want to change. We'll take a look and figure out how you can contribute!</a>\n\n<h2>Developer</h2>\n\n<a href=\"http://github.com/bdickason/shots\" target=\"_blank\">Check us out on Github.</a>\n";
  });

},{"hbsfy/runtime":46}],11:[function(require,module,exports){
/* Contribute View - For anyone who wants to contribute! */

var contributeTemplate = require('./contributeTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: contributeTemplate,
});

},{"./contributeTemplate.hbs":10}],12:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Help!</h1>\n  \n<ul class=\"help\">\n  <li>Find us on Twitter: <a href=\"http://twitter.com/bdickason\" target=\"_blank\">@bdickason</a>, <a href=\"http://twitter.com/trey_mckay\" target=\"_blank\">@trey_mckay</a></li>\n  <li>Visit our <a href=\"http://discuss.braddickason.com\">Discussion Forum</a></li>\n  <li>Visit our Chatroom</li>\n</ul>\n";
  });

},{"hbsfy/runtime":46}],13:[function(require,module,exports){
/* Help View - For anyone that needs help, gets lost, etc. */

var helpTemplate = require('./helpTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: helpTemplate,
});

},{"./helpTemplate.hbs":12}],14:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  \n    <a href=\"#\" id=\"username\">@";
  if (helper = helpers.username) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.username); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    <a href=\"/logout\" id=\"logout\">Logout</a>\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n    <a href=\"/login\" id=\"login\">Login</a>\n  ";
  }

  buffer += "  <a href=\"/\" id=\"home\">Home</a> |  \n  <a href=\"http://discuss.braddickason.com\" id=\"discuss\">Discuss</a> | \n  <a href=\"/contribute\" id=\"contribute\">Contribute</a> | \n  <a href=\"/help\" id=\"help\">Help Me!</a>\n\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.username), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

},{"hbsfy/runtime":46}],15:[function(require,module,exports){
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

},{"./navTemplate.hbs":14}],16:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "  <div class=\"view\">\n    <label><h3>Create a Project</h3></label>\n    <input id=\"name\" type=\"textarea\" class\"input\" placeholder=\"\" autofocus>\n    <button id=\"createProject\" class=\"save\">save</button>\n    <label id=\"projectsError\" class=\"error\"></label>\n    <ul class=\"projects\">\n    </ul>\n  </div> ";
  });

},{"hbsfy/runtime":46}],17:[function(require,module,exports){
/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./projectListTemplate.hbs');

var ProjectsCollectionFirebase = require('../projectsCollectionFirebase.js');

var ProjectCardView = require('../show/projectCardView.js');

module.exports = Backbone.Marionette.CompositeView.extend({
  tagName: 'div',
  template: projectsTemplate,
  itemView: ProjectCardView,
  itemViewContainer: 'ul.projects',

  initialize: function() {
    if(!this.collection) {
      this.collection = new ProjectsCollectionFirebase();
    }

    this.listenTo(this.collection, 'sync', this.render);  // Without this, the collection doesn't render after it completes loading
    this.listenTo(this.collection, 'remove', this.render);   // Collection doesn't call sync when we add a new model.
  },

  events: {
    'click .project a': 'gotoProject',
    'click #createProject': 'createProject'
  },

  gotoProject: function(e) {
    // Navigate to a specific project
    e.preventDefault(); // Have to disable the default behavior of the anchor

    projectId = e.target.id;
    route = projectId;
    app.router.navigate(route, {trigger: true});
  },

  createProject: function(project) {
    if(app.user.get('loggedIn')) {
      var name = this.$el.find('#name');
      
      if(name.val()) {
        var input = {
          id: name.val(),
          user: app.user.get('username'),
          timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
        };

        this.collection.add(input);

        mixpanel.track('Create Project', input);

        name.val('');
      }
    } else {
      this.showError('Sorry, you must be logged in');
    }
  },

  showError: function(message) {
    var error = this.$el.find('#projectsError');
    error.text(message);
    error.show();
  },
});

},{"../projectsCollectionFirebase.js":22,"../show/projectCardView.js":24,"./projectListTemplate.hbs":16}],18:[function(require,module,exports){
/* Project Model - data layer for a single Project for use in Firebase Collections */

var utils = require('../../utils.js');

module.exports = Backbone.Model.extend({
  initialize: function() {
  },
  isOwner: function(user) {
    if(this.get('user') == user) {
      return(true);
    } else {
      return(false);
    }
  },
  toJSON: function() {
    var output = utils.formatTime(this);  // Generate human-readable timestamp
    
    var currentUser = app.user.get('username');

    if(currentUser) {
      if(this.isOwner(currentUser)) {
      // User owns this project
      output.owner = true;
      }
    }

    return(output);
  }
});

},{"../../utils.js":38}],19:[function(require,module,exports){
/* Project Model - For standalone use (not in a collection) */

var utils = require('../../utils.js');

module.exports = Backbone.Firebase.Model.extend({
  firebase: function() {
    return(new Firebase(this.fbUrl));
  },
  initialize: function() {
    this.fbUrl = app.fbUrl + '/projects/' + this.get('id');
  },
  isOwner: function(user) {
    if(this.get('user') == user) {
      return(true);
    } else {
      return(false);
    }
  },
  toJSON: function() {
    var output = utils.formatTime(this);  // Generate human-readable timestamp
    
    var currentUser = app.user.get('username');

    if(currentUser) {
      if(this.isOwner(currentUser)) {
        // User owns this project
        output.owner = true;
      }
    }
    
    return(output);
  }
});

},{"../../utils.js":38}],20:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "  <a href=\"/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"project\">&lt;- ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " </a>";
  return buffer;
  });

},{"hbsfy/runtime":46}],21:[function(require,module,exports){
/* projectNav View - Renders a sub-nav for a specific project */

var projectNavTemplate = require('./projectNavTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: projectNavTemplate,

  events: {
    'click #project': 'gotoProject'
  },

  render: function() {
    this.$el.html(this.template({ id: this.id })); // Nav has no collection associated with it, so just render the tepmlate
    return this;
  },

  gotoProject: function(e) {
    // Navigate to the Project page
    
    e.preventDefault(); // Have to disable the default behavior of the anchor

    route = this.id;
    app.router.navigate(route, {trigger: true});
  }
});

},{"./projectNavTemplate.hbs":20}],22:[function(require,module,exports){
/* Projects Collection - An ordered list of Projects */
var ProjectModel = require('./projectModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ProjectModel,
    firebase: new Firebase(app.fbUrl + '/projects/'),
    initialize: function() {
    }
  });
},{"./projectModel.js":18}],23:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"project\">\n  <a href=\"/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-event=\"Show Project\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n</li>";
  return buffer;
  });

},{"hbsfy/runtime":46}],24:[function(require,module,exports){
/* Project Card View - displays a snapshot of a single projects */

var ProjectModelFirebase = require('../projectModelFirebase.js');

var projectCardTemplate = require('./projectCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: projectCardTemplate,

  initialize: function() {
    if(!this.model) {
      this.model = new ProjectModelFirebase({id: this.id});
    }
  }
});

},{"../projectModelFirebase.js":19,"./projectCardTemplate.hbs":23}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <p class=\"projectSettings\">\n      <a href=\"#edit\" id=\"editProject\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">edit</a> \n      <a href=\"#cancel\" id=\"cancelProjectEdit\" style=\"display: none\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">cancel</a> \n      <button id=\"saveProject\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Save</button> \n      <a href=\"#delete\" id=\"deleteProject\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">delete</a>\n    </p>\n  ";
  return buffer;
  }

  buffer += "<div class=\"projectDetails\">\n  <h1>";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.owner), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <label>Description</label>\n  <p class=\"description\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n  <label>Users</label>\n  <div class=\"users\">";
  if (helper = helpers.users) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.users); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n  <label>Activity</label>\n  <div class=\"activity\">";
  if (helper = helpers.activity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.activity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n</container>\n<div class=\"shots\">\n</div>\n";
  return buffer;
  });

},{"hbsfy/runtime":46}],26:[function(require,module,exports){
/* Project View - displays a single projects */

var ProjectModelFirebase = require('../projectModelFirebase.js');

var projectTemplate = require('./projectTemplate.hbs');

var ShotsCollectionFirebase = require('../../shots/shotsCollectionFirebase.js');

var ShotListView = require('../../shots/list/shotListView.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    if(!this.model) {
      this.model = new ProjectModelFirebase({id: this.id});
    }

    this.listenTo(this.model, 'sync', this.render); // Without this, the model doesn't render after it completes loading

    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    this.shotsCollectionFirebase = new ShotsCollectionFirebase([], {project: this.model.get('id')});
    this.shotListView = new ShotListView({ collection: this.shotsCollectionFirebase, project: this.model.get('id')});
  },

  events: {
    'click #editProject': 'editProject',
    'click #cancelProjectEdit': 'cancelEdit',
    'click #saveProject': 'saveProject'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    shotDiv = this.$el.find('div.shots');
    shotDiv.html(this.shotListView.render().el);

    this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js    
    return this;
  },

 editProject: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {
      // Replace current edit button with cancel link
      $(e.currentTarget).hide();  // Hide edit button

      var settings = this.$el.children('p.projectSettings');

      settings.children('#cancelProjectEdit').show();

      saveButton = settings.children('#saveProject').show();

      // Turn name into editable field
      projectName = this.$el.children('h1');
      projectName.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
      projectName.focus();
    }
  },

  cancelEdit: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor
    
    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {
      // Replace cancel link with edit button
      $(e.currentTarget).hide();

      var settings = this.$el.children('p.projectSettings');

      saveButton = settings.children('#saveProject').hide();
      editButton = settings.children('#editProject').show();

      // reset name to normal
      projectName = this.$el.children('h1');
      projectName.attr('contenEditable', 'false');
      projectName.blur();

      this.render();  // projectName does not update unless we re-render
    }
  },

  saveProject: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var currentUser = app.user.get('username');

    if(this.model.isOwner(currentUser)) {

      // Return interface to normal
      $(e.currentTarget).hide();  // Hide save button

      var settings = this.$el.children('p.projectSettings');

      cancelButton = settings.children('#cancelProjectEdit').hide();
      editButton = settings.children('#editProject').show();

      // name is no longer editable
      projectName = this.$el.children('h1');
      projectName.attr('contentEditable', 'false');
      projectName.blur();

      // Save new name
      this.model.set('id', projectName.text());

      var modelId = this.model.get('id');
      route = '/' + modelId;

      // Redirect user to new url
      app.router.navigate(route, { trigger: true });
    }
  }
});

},{"../../shots/list/shotListView.js":28,"../../shots/shotsCollectionFirebase.js":31,"../projectModelFirebase.js":19,"./projectTemplate.hbs":25}],27:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "    <label><h3>What are you working on?</h3></label>\n    <input id=\"image\" type=\"url\" class=\"input\" size=\"58\" placeholder=\"Enter a URL to an image\"><br />\n    <textarea id=\"text\" type=\"text\" maxlength=\"300\" class=\"input\" placeholder=\"Enter any additional info\" /><br />\n    <button id=\"createShot\">save</button>\n    <label id=\"shotsError\" class=\"error\"></label>\n    <ul class=\"shots\">\n    </ul>";
  });

},{"hbsfy/runtime":46}],28:[function(require,module,exports){
/* Shots View - displays a list of shots */

var ShotCardView = require('../show/shotCardView.js');
var shotListTemplate = require('./shotListTemplate.hbs');

module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'div',
    template: shotListTemplate,

    itemView: ShotCardView,
    itemViewContainer: 'ul.shots',

    initialize: function(options) {
      this.project = options.project;  // Save project name in case we need to add
      
      this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event
    },
    
    events: {
      'keyup .input': 'pressEnter',
      'click #createShot': 'createShot',
      'click #deleteShot': 'deleteShot',
      'click img': 'toggleSize',
      'error': 'showError'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.createShot();
      }
      return(false);
    },

    createShot: function(shot) {
      if(app.user.get('loggedIn')) {
        var textField = this.$el.find('#text');
        var imageField = this.$el.find('#image');
        if(textField.val() || imageField.val()) {
          var input = {
            text: textField.val(),
            image: this.parseImageUrl(imageField.val()),
            user: app.user.get('username'),
            timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
            projectId: this.project
          };

          this.collection.create(input);
          mixpanel.track('Create Shot', input);

          textField.val('');
          imageField.val('');
        }
      }
      else {
        this.showError('Sorry, you must be logged in');
      }
    },

    deleteShot: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      var shotId = $(e.currentTarget).data('id');
      var shot = this.collection.get(shotId);
      var owner = shot.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(shot);
      }
    },

    parseImageUrl: function(url) {
      // Some image hosts default to give the user a webpage displaying the image, but we need to extract the direct link
      switch(url.substring(0, 19)) {
        case 'http://cl.ly/image/':
          // Cloudapp link
          // Example Link: http://cl.ly/image/3w3x2u363M1o
          // Example Image: http://cl.ly/image/3w3x2u363M1o/download
          url += '/download';
          break;
        case 'https://www.dropbox':
          // Dropbox Link
          // Example Link: https://www.dropbox.com/s/axdpwwv3lematw9/Screenshot%202014-02-22%2017.14.46.png
          // Example Image: https://dl.dropboxusercontent.com/s/axdpwwv3lematw9/Screenshot%202014-02-22%2017.14.46.png?dl=1&token_hash=AAFao11at8PTdSH5T7qKaX0wiDo1deZFfB-5YQgLYiv6gA
          // Hopefully we don't need the token_hash :x
          url = 'https://dl.dropboxusercontent.com' + url.slice(23);  // Remove domain and https
          break;
        default:
          // For all other images, just pass the link through
      }

        return(url);
    },

    toggleSize: function(e) {
      // Enlarge or shrink a shot image
      $(e.currentTarget).toggleClass('big');
    },

    showError: function(message) {
      var error = this.$el.find('#shotsError');
      error.text(message);
      error.show();
    },

    onRender: function() {
      this.delegateEvents();
    }
  });

},{"../show/shotCardView.js":33,"./shotListTemplate.hbs":27}],29:[function(require,module,exports){
/* Shot Model - data layer for a single Shot */

var utils = require('../../utils.js');

module.exports = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
      text: ''
    },
    toJSON: function() {
      var output = utils.formatTime(this);  // Generate human-readable timestamp
      
      if(this.get('user') === app.user.get('username')) {
        // User owns this comment
        output.owner = true;
      }
      
      return(output);         // Generate human-readable timestamp
    }
});

},{"../../utils.js":38}],30:[function(require,module,exports){
/* Shot Model - Standalone model (do not use in collections) */

var utils = require('../../utils.js');

module.exports = Backbone.Firebase.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/shots/' + this.get('projectId') + '/' + this.get('id');
    },
    defaults: {
      text: ''
    },
    toJSON: function() {
      var output = utils.formatTime(this);  // Generate human-readable timestamp
      
      if(this.get('user') === app.user.get('username')) {
        // User owns this comment
        output.owner = true;
      }
      
      return(output);         // Generate human-readable timestamp
    }
});

},{"../../utils.js":38}],31:[function(require,module,exports){
/* Shots Collection - An ordered list of Shots */
var ShotModel = require('./shotModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ShotModel,
    comparator: function(model) {
      // Sorts model by timestamp, newest first
      return(-model.get('timestamp'));
    },
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function(models, options) {
        this.fbUrl = app.fbUrl + '/shots/' + options.project;
    }
  });
},{"./shotModel.js":29}],32:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"/";
  if (helper = helpers.projectId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.projectId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"shotlink\" id=\"";
  if (helper = helpers.projectId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.projectId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Posted ";
  if (helper = helpers.time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " by ";
  if (helper = helpers.user) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a><br />\n<img src=\"";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"shotImage\" class=\"shot\">\n<p id=\"shotText\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n<p class=\"shotCreator\">";
  if (helper = helpers.user) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p><div class=\"shotComments\"></div>";
  return buffer;
  });

},{"hbsfy/runtime":46}],33:[function(require,module,exports){
/* Shot View - displays a shot module embedded inside another page */

var ShotModelFirebase = require('../shotModelFirebase.js');

var shotCardTemplate = require('./shotCardTemplate.hbs');

var CommentsCollectionFirebase = require('../../comments/commentsCollectionFirebase.js');
var CommentsCardView = require('../../comments/list/commentListCardView.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: shotCardTemplate,

  initialize: function(options) {
    if(!this.model) {
      // Model is not passed in by parent View
      this.model = new ShotModelFirebase({id: options.id, projectId: options.projectId});
    }
   
    this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
    this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere

    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    // Setup comment card to show # of comments
    this.commentsCollectionFirebase = new CommentsCollectionFirebase([], {shotId: this.model.get('id'), projectId: this.model.get('projectId')});
    this.commentsCardView = new CommentsCardView({ collection: this.commentsCollectionFirebase});

    this.$el.attr('id', this.model.get('id'));
    this.$el.addClass('shot');
  },

  events: {
    'click .shotlink': 'gotoShot',
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    // Render comments
    this.$el.find('.shotComments').html(this.commentsCardView.render().el);
    
    this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
    
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('projectId') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});
  }
});

},{"../../comments/commentsCollectionFirebase.js":3,"../../comments/list/commentListCardView.js":5,"../shotModelFirebase.js":30,"./shotCardTemplate.hbs":32}],34:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <p class=\"shotSettings\">\n    <a href=\"#edit\" id=\"editShot\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">edit</a> \n    <a href=\"#cancel\" id=\"cancelShotEdit\" style=\"display: none\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">cancel</a> \n    <button id=\"saveShot\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Save</button> \n    <a href=\"#delete\" id=\"deleteShot\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">delete</a>\n  </p>\n";
  return buffer;
  }

  buffer += "<a href=\"/";
  if (helper = helpers.projectId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.projectId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"shotlink\" id=\"";
  if (helper = helpers.projectId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.projectId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Posted ";
  if (helper = helpers.time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " by ";
  if (helper = helpers.user) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a><br />\n<img src=\"";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"shotImage\" class=\"shot\">\n<p id=\"shotText\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.owner), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<ul id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"comments\">\n</ul>";
  return buffer;
  });

},{"hbsfy/runtime":46}],35:[function(require,module,exports){
/* Shot View - displays a shot module embedded inside another page */

var ShotModelFirebase = require('../shotModelFirebase.js');

var shotTemplate = require('./shotTemplate.hbs');

var CommentsCollectionFirebase = require('../../comments/commentsCollectionFirebase');
var CommentsView = require('../../comments/list/commentListView.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: shotTemplate,
  className: 'shot',
  id: function() {
    return(this.model.get('id'));
  },

  initialize: function(options) {
    if(!this.model) {
      // Model is not passed in by parent View
      this.model = new ShotModelFirebase({id: options.id, projectId: options.projectId});
    }
   
    this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
    this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere
   
    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    this.commentsCollectionFirebase = new CommentsCollectionFirebase([], {shotId: this.model.get('id'), projectId: this.model.get('projectId')});
    this.commentsView = new CommentsView({ collection: this.commentsCollectionFirebase});
  },

  events: {
    'click .shotlink': 'gotoShot',
    'click #editShot': 'editShot',
    'click #cancelShotEdit': 'cancelEdit',
    'click #saveShot': 'saveShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    // Render comments
    this.$el.find('.comments').html(this.commentsView.render().el);
    
    // this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
    
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('projectId') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});
  },

  editShot: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {
      // Replace current edit button with cancel link
      $(e.currentTarget).hide();  // Hide edit button   

      cancelButton = this.$el.children('p').children('#cancelShotEdit').show();
      // cancelButton.on('click', _.bind(this.cancelEdit, this));

      saveButton = this.$el.children('p').children('#saveShot').show();

      // Turn image into textarea
      shotImage = this.$el.children('#shotImage');
      shotImage.attr('contentEditable', 'true');

      // Turn text into textarea
      shotText = this.$el.children('#shotText');
      shotText.attr('contentEditable', 'true');  // Built in html5 tag to make field editable
      shotText.focus();
    }
  },

  cancelEdit: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor
    
    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {
      // Replace cancel link with edit button
      $(e.currentTarget).hide();
      saveButton = this.$el.children('p').children('#saveShot').hide();
      editButton = this.$el.children('p').children('#editShot').show();

      // reset image to normal
      shotImage = this.$el.children('#shotImage');
      shotImage.attr('contentEditable', 'false');

      // reset text to normal
      shotText = this.$el.children('#shotText');
      shotText.attr('contenEditable', 'false');
      shotText.blur();

      this.render();  // commentText does not update unless we re-render
    }
  },

  saveShot: function(e) {
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var owner = this.model.get('user');

    if(app.user.get('username') == owner) {

      // Return interface to normal
      $(e.currentTarget).hide();  // Hide save button
      cancelButton = this.$el.children('p').children('#cancelShotEdit').hide();
      editButton = this.$el.children('p').children('#editShot').show();

      // image is no longer editable
      shotImage = this.$el.children('#shotImage');
      shotImage.attr('contentEditable', 'false');
      shotImage.blur();
      
      // text is no longer editable
      shotText = this.$el.children('#shotText');
      shotText.attr('contentEditable', 'false');
      shotText.blur();

      // Save next text value
      this.model.set('image', shotImage.attr('src'));
      this.model.set('text', shotText.text());
    }
  }
});

},{"../../comments/commentsCollectionFirebase":3,"../../comments/list/commentListView.js":7,"../shotModelFirebase.js":30,"./shotTemplate.hbs":34}],36:[function(require,module,exports){
/* User Model - Standalone model integrated w/ Firebase simple login 

displayName: User's full name
profileImage: User's avatar
username: user's handle
*/

module.exports = Backbone.Model.extend({
    initialize: function() {
      /* Authentication via Twitter/Firebase */
      var fbRef = new Firebase(app.fbUrl);
      var model = this;

      // Firebase auth library, triggered on sign in/sign out
      app.auth = new FirebaseSimpleLogin(fbRef, function(error, user) {

        if(user) {
          // Login was successful
          userData = {
            displayName: user.displayName,
            profileImage: user.profile_image_url_https,
            lastLogin: new Date(),
            username: user.username,
            loggedIn: true
          };
          model.set(userData);

          mixpanel.identify(userData.username);
          mixpanel.people.set({
            "$last_login": userData.lastLogin,
            "$name": userData.displayName,
            "$username": userData.username,
            "service": "Twitter"
          });
        }
        else {
          // User logged out
          model.clear();
        }
      });
    },
    login: function(service) {
      // Logs a user into the app
      app.auth.login(service);
    },
    logout: function() {
      // Logs a user out of the app
      app.auth.logout();
    }
});

},{}],37:[function(require,module,exports){
/* Routes - Contains all routes for client-side app */

// Top Navigation
var NavView = require('./components/nav/navView.js');

// Projects
var ProjectListView = require('./components/projects/list/projectListView.js');
var ProjectView = require('./components/projects/show/projectView.js');
var ProjectNavView = require('./components/projects/projectNav/projectNavView.js');   // Used in Shot view

// Shots
var ShotView = require('./components/shots/show/shotView.js');

// Contribute
var ContributeView = require('./components/contribute/contributeView.js');

// Help
var HelpView = require('./components/help/helpView.js');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        'contribute(/)': 'contribute',
        'help(/)': 'help',
        ':project/:shot(/)': 'shot',    // the (/) catches both :shot and :shot/
        ':project(/)': 'project'
    },

    home: function(params) {
        // Default Route (/) - Display a list of the most recently updated projects
        console.log('Route: /');

        // Sub-nav Hack for Marionette Layouts
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Hack for Marionette Layouts
        app.subhead.close();

        // Display list of latest projects
        var projectListView = new ProjectListView();
        app.content.show(projectListView);
    },

    project: function(project) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + project);

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Display a single project
        var projectView = new ProjectView({id: project});

        app.content.show(projectView);
    },

    shot: function(project, shot) {
        // (/:projectName/shotName) - Loads a single shot
        console.log('[shot]: /#' + project + '/' + shot);

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Display 'project' sub-navigation
        var projectNav = new ProjectNavView({id: project});
        app.subhead.show(projectNav);

        // Display a single shot
        var shotView = new ShotView({id: shot, projectId: project });
        app.content.show(shotView);
    },

    contribute: function() {
        // (/contribute) - Contribute to this project
        console.log('Route: contribute');

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Display contribute page
        var contributeView = new ContributeView();
        app.content.show(contributeView);
    },

    help: function() {
        // (/help) - Getting Started, Documentation, etc.
        console.log('Route: help');

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Display help content
        var helpView = new HelpView();
        app.content.show(helpView);
    }
});
},{"./components/contribute/contributeView.js":11,"./components/help/helpView.js":13,"./components/nav/navView.js":15,"./components/projects/list/projectListView.js":17,"./components/projects/projectNav/projectNavView.js":21,"./components/projects/show/projectView.js":26,"./components/shots/show/shotView.js":35}],38:[function(require,module,exports){
/* utils - Utility functions */

app.Handlebars = require('hbsfy/runtime');  // Needed for Handlebars mixins in utils.js
var moment = require('moment');

module.exports.debug = function(e, results) {
    // spits out whatever event is fired
    // Usage (within a view): this.listenTo(this.model, 'all', app.utils.debug);
    console.log(e);
    console.log(results);
};

module.exports.formatTime = function(model) {
    // Takes a model and adds a `time` object that has string-formatted time via moment
    // Usage (within a model): app.utils.formatTime(this);

    var json = Backbone.Model.prototype.toJSON.call(model);  // Get existing toJSON data
    json.time = moment(model.get('timestamp')).fromNow();    // Get time in the format Time from Now: http://momentjs.com/docs/#/displaying/fromnow/
    return(json);
};


app.Handlebars.registerHelper('pluralize', function(number, singular, plural) {
    // Handlebars helper for plural variables
    // Use: {{pluralize object 'single_string' 'plural_string'}}
    //
    // Example: "0 comments" vs. "1 comment" vs. "5 comments"
    // {{pluralize this.length "comment" "comments" }}
    // Assumes the collection is being loaded as 'this'

    switch(number) {
        case 0:
            return(plural);
        case 1:
            return(singular);
        default:
            return(plural);
    }
});
},{"hbsfy/runtime":46,"moment":47}],39:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":40,"./handlebars/exception":41,"./handlebars/runtime":42,"./handlebars/safe-string":43,"./handlebars/utils":44}],40:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":41,"./utils":44}],41:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],42:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":40,"./exception":41,"./utils":44}],43:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],44:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":43}],45:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":39}],46:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":45}],47:[function(require,module,exports){
//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.5.1",
        global = this,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            mom.month(mom.month() + months * isAdding);
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                var int_val = parseInt(val, 10);
                return val ?
                  (val.length < 3 ? (int_val > 68 ? 1900 + int_val : 2000 + int_val) : int_val) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else {
            config._d = new Date(input);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function (input) {
        return moment(input).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var sod = makeAs(moment(), this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '',
                dayOfMonth;

            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }

                dayOfMonth = this.date();
                this.date(1);
                this._d['set' + utc + 'Month'](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));

                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function () {
            return Math.ceil((this.month() + 1.0) / 3.0);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(deprecate) {
        var warned = false, local_moment = moment;
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        if (deprecate) {
            global.moment = function () {
                if (!warned && console && console.warn) {
                    warned = true;
                    console.warn(
                            "Accessing Moment through the global scope is " +
                            "deprecated, and will be removed in an upcoming " +
                            "release.");
                }
                return local_moment.apply(null, arguments);
            };
            extend(global.moment, local_moment);
        } else {
            global['moment'] = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
        makeGlobal(true);
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal !== true) {
                // If user provided noGlobal, he is aware of global
                makeGlobal(module.config().noGlobal === undefined);
            }

            return moment;
        });
    } else {
        makeGlobal();
    }
}).call(this);

},{}]},{},[1])
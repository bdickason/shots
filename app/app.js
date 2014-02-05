/* Main app js file */

app = {};

window.onload = function(){
  Backbone.$ = window.$;

  var ShotsView = require('./views/shotsView.js');
  var ProjectsView = require('./views/projectsView.js');

  var ShotsCollection = require('./collections/shotsCollection.js');
  var ProjectsCollection = require('./collections/projectsCollection.js');

  app.projects = new ProjectsCollection();

  var projectsView = new ProjectsView({collection: app.projects});
};


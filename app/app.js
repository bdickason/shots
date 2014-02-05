/* Main app js file */

app = {};

window.onload = function(){
  Backbone.$ = window.$;

  app.ShotModel = require('./models/shotModel.js');

  var ShotsView = require('./views/shotsView.js');
  var shotModel = new app.ShotModel({id: 'model-edit'});
  var ShotsCollection = require('./collections/shotsCollection.js');
  var ProjectsCollection = require('./collections/projectsCollection.js');

  var shotsView = new ShotsView();
  var shotsCollection = new ShotsCollection(shotModel);

  app.projects = new ProjectsCollection();
};


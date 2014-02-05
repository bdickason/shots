/* Main app js file */

window.onload = function(){
  Backbone.$ = window.$;

  var ShotModel = require('./models/shotModel.js');

  var ShotsView = require('./views/shotsView.js');
  var shotModel = new ShotModel({id: 'model-edit'});
  var ShotsCollection = require('./collections/shotsCollection.js');

  var shotsView = new ShotsView();
  var shotsCollection = new ShotsCollection(shotModel);
  console.log(shotsCollection.pluck('id'));

};


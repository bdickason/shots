/* Main app js file */

window.onload = function(){
  Backbone.$ = window.$;
  var ShotsView = require('./views/shotsView.js');
  var shotsView = new ShotsView();
};


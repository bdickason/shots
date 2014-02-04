/* Main app js file */

window.onload = function(){
  Backbone.$ = window.$;
  var AppView = require('./views.js');
  var appView = new AppView();
};


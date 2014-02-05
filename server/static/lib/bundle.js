(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./collections/projectsCollection.js":2,"./collections/shotsCollection.js":3,"./models/shotModel.js":5,"./views/shotsView.js":6}],2:[function(require,module,exports){
/* Projects Collection - An ordered list of Projects */
var ProjectModel = require('../models/projectModel.js');

module.exports = Backbone.Collection.extend({
    model: ProjectModel,
    url: '/projects',
    initialize: function() {
      this.fetch();
    }
  });
},{"../models/projectModel.js":4}],3:[function(require,module,exports){
/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.Collection.extend({
    model: app.ShotModel
  });

},{"../models/shotModel.js":5}],4:[function(require,module,exports){
/* Project Model - data layer for a single Project */
module.exports = Backbone.Model.extend({
  initialize: function() {
    console.log("init!");
  },
    defaults: {
      text: ''
    }
  });

},{}],5:[function(require,module,exports){
/* Shot Model - data layer for a single Shot */
module.exports = Backbone.Model.extend({
    defaults: {
      text: ''
    }
  });

},{}],6:[function(require,module,exports){
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

},{}]},{},[1])
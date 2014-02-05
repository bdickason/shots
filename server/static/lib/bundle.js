(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./collections/shotsCollection.js":2,"./models/shotModel.js":3,"./views/shotsView.js":4}],2:[function(require,module,exports){
/* Shots Collection - An ordered list of Shots */
var ShotModel = require('../models/shotModel.js');
var shotModel = new ShotModel({id: 'model-edit'});

module.exports = Backbone.Collection.extend({
    model: shotModel
  });

},{"../models/shotModel.js":3}],3:[function(require,module,exports){
/* Shot Model - data layer for a single Shot */
module.exports = Backbone.Model.extend({
    defaults: {
      text: ''
    }
  });

},{}],4:[function(require,module,exports){
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
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Main app js file */

window.onload = function(){
  Backbone.$ = window.$;
  var AppView = require('./views.js');
  var appView = new AppView();
  //console.log("awesomer! wtf."
};


},{"./views.js":2}],2:[function(require,module,exports){
/* Views go here */
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
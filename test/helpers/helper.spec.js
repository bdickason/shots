// 
// Sets up an environment that mimics a browser by globally exposing pieces
// such as a DOM with jsdom, the app namespace that components attach to,
// and any other libraries commonly expected to be globally exposed like Backbone
// Underscore, and jQuery. This allows us speedily to test client-side components
// without the drag of running a browser, headless or real.
// 

var jsdom = require ('jsdom'),
    fs = require('fs'),
    path = require('path');

module.exports.setup = setup = function(callback) {
  if(typeof window != 'undefined') return callback(window);
  
  // Setup a jsdom env and globally expose window along with other libraries
  jsdom.env({
    html: "<html><body></body></html>",
    scripts: ['//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js',
              '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js',
              '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min.js',
              'https://cdn.firebase.com/v0/firebase.js',
              'https://cdn.firebase.com/libs/backfire/0.3.0/backbone-firebase.js',
              'https://cdn.firebase.com/js/simple-login/1.2.5/firebase-simple-login.js'
              ],
    done: function(errs, window) {
      global.window = window;
      global.backbone = window.Backbone;

      /*
      global.Backbone = require('../../public/javascripts/vendor/backbone.js');
      global.Backbone.$ = global.$ = require('../../public/javascripts/vendor/jquery.js');
      global._ = require('../../public/javascripts/vendor/underscore.js');
      */
      global.app = {};
      callback();
    }
  });
};
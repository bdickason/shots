// 
// Sets up an environment that mimics a browser by globally exposing pieces
// such as a DOM with jsdom, the app namespace that components attach to,
// and any other libraries commonly expected to be globally exposed like Backbone
// Underscore, and jQuery. This allows us speedily to test client-side components
// without the drag of running a browser, headless or real.
// 

var jsdom = require ('jsdom'),
    fs = require('fs'),
    path = require('path'),
    sinon = require('sinon');

module.exports.setup = setup = function(callback) {
  if(typeof window != 'undefined') return callback(window);

  var scriptDir = '../../server/static/lib/';

  // Inject css so styles are set properly
  var css = '<style type="text/css">';
  css += fs.readFileSync(path.normalize(__dirname + "/../../server/static/css/screen.css"), 'utf8');
  css += '</style>';

  // Setup a jsdom env and globally expose window along with other libraries
  jsdom.env({
    html: "<html><head>" + css + "</head><body></body></html>",
    scripts: [scriptDir + 'jquery-2.1.0.min.js',
              scriptDir + 'underscore.js',
              scriptDir + 'backbone.js',
              scriptDir + 'backbone.marionette.js',
              scriptDir + 'firebase.js',
              scriptDir + 'backbone-firebase.js',
              scriptDir + 'firebase-simple-login.js',
              ],
    done: function(errs, window) {
      global.window = window;
      
      global._ = window._;
      global.Backbone = window.Backbone;
      global.Backbone.$ = global.$ = window.$;
      global.Firebase = window.Firebase;
      global.FirebaseSimpleLogin = window.FirebaseSimpleLogin;

      global.appDir = '../../app/';
      global.componentsDir = global.appDir + 'components/';

      global.app = {};

      global.app.Handlebars = require('handlebars');

      // Fake mixpanel object
      global.mixpanel = {
        identify: sinon.stub().returns('123'),
        people: {
          set: function(data) {
            return(data);
          }
        },
        track: sinon.stub().returns('success')
      };
      
      callback();
    }
  });
};
var express = require('express');
var handlebars = require('express3-handlebars');

cfg = require('./cfg/config.js');

module.exports.startServer = function() {
  app = express();
  hbs = handlebars.create();

  // Configure middleware
  app.use(express.bodyParser());
  app.use(express.favicon());
  app.use(express.static(__dirname + '/static'));
  app.engine('handlebars', hbs.engine);
  app.set('views', './server/views');
  app.set('view engine', 'handlebars');

  /* Client-side Routes */
  app.get('/', function(req, res) {
    // Default Route - serves the Backbone app
    res.render('client', { cfg: cfg } );
  });

  app.get('*', function(req, res) {
    res.send('Sorry, there was a problem with your request');
    console.log('--- UNKNOWN REQUEST ---');
  });

  app.listen(cfg.PORT); // Start the server
};
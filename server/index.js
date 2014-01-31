express = require('express');
http = require('http');
cfg = require('./cfg/config.js');

module.exports.startServer = function() {
  app = express();

  // Configure middleware
  app.use(express.favicon());

  // Routes
  app.get('/', function(req, res) {
    // Default Route - serves the Backbone app
    res.send("index");
  });

  // API Routes
  app.get('/projects/:project', function(req, res) {
    res.json({ "project": req.params.project});
  });

  app.listen(cfg.PORT); // Start the server
};
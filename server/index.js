express = require('express');
db = require('./db');

cfg = require('./cfg/config.js');

module.exports.startServer = function() {
  app = express();

  // Configure middleware
  app.use(express.favicon());

  // Configure Database once when app starts
  db.setup(cfg);

  // Routes
  app.get('/', function(req, res) {
    // Default Route - serves the Backbone app
    console.log(db);
    res.send('index');
  });

  // API Routes
  app.get('/projects/:project', function(req, res) {
    db.getProjects()
    res.json({ "project": req.params.project});
  });

  app.listen(cfg.PORT); // Start the server
};
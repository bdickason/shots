express = require('express');
r = require('rethinkdb');

cfg = require('./cfg/config.js');

module.exports.startServer = function() {
  app = express();

  // Configure middleware
  app.use(express.favicon());

  // Configure Database
  db = r.connect({ host: cfg.RETHINKDB_HOST, port: cfg.RETHINKDB_PORT }, function(err, conn) {
    if(err) throw err;
    console.log(conn);
  });

  // Routes
  app.get('/', function(req, res) {
    // Default Route - serves the Backbone app
    res.send('index');
  });

  // API Routes
  app.get('/projects/:project', function(req, res) {
    res.json({ "project": req.params.project});
  });

  app.listen(cfg.PORT); // Start the server
};
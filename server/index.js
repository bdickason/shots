var express = require('express');

db = require('./db'); // db currently initialized as a global variable

/* Models */
var projects = require('./projects/projects.js');
var shots = require('./shots/shots.js');

cfg = require('./cfg/config.js');

module.exports.startServer = function() {
  app = express();

  // Configure middleware
  app.use(express.favicon());

  // Configure Database once when app starts
  db.setup(cfg, function() {
  });

  /* Client-side Routes */
  app.get('/', function(req, res) {
    // Default Route - serves the Backbone app
    res.send('index');
  });

  /* API Routes */
  app.get('/projects', function(req, res) {
    // Returns a list of all projects

    projects.get(function(callback) {
      res.json(callback);
    });
  });

  app.put('/projects/:project', function(req, res) {
    // Adds a new Project

    project = {"name": req.params.project };

    projects.put(project, function(callback) {
      res.json(callback);
    });
  });

  app.get('/projects/:project', function(req, res) {
    // Returns detailed information about a single shot

    project = req.params.project;

    projects.getById(project, function(callback) {
      res.json(callback);
    });
  });

  app.get('/projects/:project/:shot', function(req, res) {
    // Returns a list of shots for a given project

    project = req.params.project;
    shot = req.params.shot;

    shots.getById(shot, project, function(callback) {
      res.json(callback);
    });
  });



  app.listen(cfg.PORT); // Start the server
};
var express = require('express');
var handlebars = require('express3-handlebars');

db = require('./db'); // db currently initialized as a global variable

/* Models */
var projects = require('./projects/projects.js');
var shots = require('./shots/shots.js');

cfg = require('./cfg/config.js');
console.log(cfg);

module.exports.startServer = function() {
  app = express();
  hbs = handlebars.create();

  // Configure middleware
  app.use(express.bodyParser());
  app.use(express.favicon());
  app.use(express.static(__dirname + '/static'));
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');


  // Configure Database once when app starts
  db.setup(cfg, function() {
  });

  /* Client-side Routes */
  app.get('/', function(req, res) {
    // Default Route - serves the Backbone app
    res.render('client');
  });

  /* API Routes */
  app.get('/api/projects', function(req, res) {
    // Returns a list of all projects
    // Example: curl http://localhost:3000/projects

    projects.get(function(callback) {
      res.json(callback);
    });
  });

  app.post('/api/projects', function(req, res) {
    // Adds a new Project
    // Example: curl -X POST http://localhost:3000/api/projects?project=model-edit

    input = {"id": req.query.project };

    projects.post(input, function(callback) {
      res.json(callback);
    });
  });

  app.get('/api/projects/:project', function(req, res) {
    // Returns detailed information about a single project
    // Example: curl http://localhost:3000/projects/model-edit

    project = req.params.project;

    projects.getById(project, function(callback) {
      res.json(callback);
    });
  });

  app.get('/api/projects/:project/:shot', function(req, res) {
    // Returns a list of shots for a given project

    project = req.params.project;
    shot = req.params.shot;

    shots.getById(shot, project, function(callback) {
      res.json(callback);
    });
  });

  app.post('/api/projects/:project', function(req, res) {
    // Adds a new shot to a project
    // Example: curl -X PUT http://localhost:3000/api/projects/model-edit?author=bdickason
    // * Note: Requires a project to create

    project = req.params.project;
    author = req.body.author || null;
    text = req.body.text || null;
    image = req.body.image || null;

    var input = {
        "project": project,
        "author": author || null,
        "text": text || null,
        "image": image || null
      };

    shots.post(input, function(callback) {
      res.json(callback);
    });
  });



  app.listen(cfg.PORT); // Start the server
};
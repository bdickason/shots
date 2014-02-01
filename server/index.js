express = require('express');
db = require('./db');

cfg = require('./cfg/config.js');

var db;

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
  app.get('/projects', function(req, res) {
    // Returns a list of all projects
    exampleResponse =
    [
      { "id": 0,
        "name": "model-edit",
        "shots": [
          { "id": 0 },
          { "id": 1 }
        ]
      },
      { "id": 1,
        "name": "facebook-login",
        "shots": [
          { "id": 5 },
          { "id": 90 }
        ]
      }
    ];

    res.json(exampleResponse);
  });

  app.get('/projects/:project', function(req, res) {
    // Returns detailed information about a single shot

    project = req.params.project;

    exampleResponse =
    {
      "id": 0,
      "name": project,
      "shots": [
          { "id": 0 },
          { "id": 1 },
          { "id": 2 },
      ]
    };

    res.json(exampleResponse);
  });

  app.get('/projects/:project/:shot', function(req, res) {
    // Returns a list of shots for a given project

    project = req.params.project;
    shot = req.params.shot;

    exampleResponse =
    {
      "id": req.params.shot,
      "author": {
        "id": 6,
        "avatar": "http://www.google.com/blah.jpg",
        "name": "bdickason"
      },
      "text": "blah blah blah blah blah.",
      "images": [
        { "url": "http://google.com/blah1.jpg" },
        { "url": "http://google.com/blah2.jpg" }
      ]
    };

    res.json(exampleResponse);
  });



  app.listen(cfg.PORT); // Start the server
};
/* Model/Controller for Projects 

A project is defined by a project name.

For example: model-edit

A project has many shots, ordered in chronological order.

Example:
  {
    "name": project,
    "shots": [
        { "id": 0 },
        { "id": 1 },
        { "id": 2 },
    ]
  };

*/

var shots = require('../shots/shots.js');

module.exports.get = function(callback) {
  /* Gets a list of all projects 

    var exampleResponse =
    [
      { "name": "model-edit",
        "shots": [
          { "id": 0 },
          { "id": 1 }
        ]
      },
      { "name": "facebook-login",
        "shots": [
          { "id": 5 },
          { "id": 90 }
        ]
      }
    ];
  */

  db.get('projects', function(err, data) {
    if(!err) {
      callback(data);
    }
    else
      throw(err);
  });
};

module.exports.getById = function(name, callback) {
  /* Gets a single Project by ID 

    var exampleResponse =
    {
      "name": project,
      "shots": [
          { "id": 0 },
          { "id": 1 },
          { "id": 2 },
      ]
    };
  */

  db.getById(name, 'projects', function(err, projectData) {
    if(!err) {
      shots.getByProject(name, function(shotData) {
        projectData.shots = shotData;
        callback(projectData);
      });
    }
    else {
      throw(err);
    }
  });
};


module.exports.post = function(input, callback) {
  /* Creates a new project 
    var exampleResponse =
    {
      "name": project,
      "shots": [
          { "id": 0 },
          { "id": 1 },
          { "id": 2 },
      ]
    };
  */
  
  
  db.post(input, 'projects', function(err, data) {
    if(!err) {
      callback(data);
    }
    else {
      throw(err);
    }
  });
};
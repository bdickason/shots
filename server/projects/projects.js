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

module.exports.get = function(callback) {
  /* Gets a list of all projects */
  exampleResponse =
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
    callback(exampleResponse);
};

module.exports.getById = function(id, callback) {
  /* Gets a single Project by ID */
  console.log(project);
  exampleResponse =
    {
      "name": id,
      "shots": [
          { "id": 0 },
          { "id": 1 },
          { "id": 2 },
      ]
    };

  callback(exampleResponse);
};
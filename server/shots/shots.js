/* Model/Controller for Shots

A Shot is a combination of text and/or images posted by a user.

A Shot may only belong to one project.

Example:
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

*/

module.exports.getById = function(id, project, callback) {
  /* Gets a single Shot by ID */

  exampleResponse =
  {
    "id": id,
    "project": project,
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

  callback(exampleResponse);
};
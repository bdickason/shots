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

module.exports.getById = function(shot, project, callback) {
  /* Gets a single Project by ID */

  /*
  Example:
  {
    "id": req.params.shot,
    "author": {
      "id": 6,
      "avatar": "http://www.google.com/blah.jpg",
      "name": "bdickason"
    },
    "text": "blah blah blah blah blah.",
    "image": "http://google.com/blah2.jpg"
  }; */

  db.getById(shot, 'shots', function(err, data) {
    if(!err) {
      callback(data);
    }
    else {
      throw(err);
    }
  });
};

module.exports.getByProject = function(project, callback) {
  /* Gets all shots associated with a project */

  /*
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
  }; */

  db.getByFilter(project, 'shots', function(err, data) {
    if(!err) {
      callback(data);
    }
    else {
      throw(err);
    }
  });
};



module.exports.put = function(input, callback) {
  /* Creates a new project */
  
  db.put(input, 'shots', function(err, data) {
    if(!err) {
      callback(data);
    }
    else {
      throw(err);
    }
  });
};
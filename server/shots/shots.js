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
  /* Gets a single shot by ID */

  /*
  Example:
  {
    "id": 0,
    "author": "bdickason",
    "text": "blah blah blah blah blah.",
    "image": "http://google.com/blah2.jpg"
  }; */

  shot = parseInt(shot, 0);

  filter = {
    id: shot,
    project: project
  };



  db.getByFilter(filter, 'shots', function(err, data) {
    if(!err) {
      callback(data[0]);
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

  filter = {project: project};  // Must use explicit json so rethinkdb exact matches

  db.getByFilter(filter, 'shots', function(err, data) {
    if(!err) {
      callback(data);
    }
    else {
      throw(err);
    }
  });
};



module.exports.post = function(input, callback) {
  /* Creates a new shot */

  filter = { project: input.project };
  // Get last shot Id (so we know what our shot's ID should be as RethinkDb does not have an auto_increment)
  
  db.getLast(filter, 'shots', function(err, lastData) {
    if(!err) {
      if(lastData) {
        input.id = lastData.id + 1;
      }
      else {
        input.id = 0;
      }
      

      // Put the shot in with the proper ID
      db.post(input, 'shots', function(err, putData) {
        if(!err) {
          callback(putData);
        }
        else {
          throw(err);
        }
      });
    }
    else {
      throw(err);
    }
    

  });
  

};
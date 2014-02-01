shots
=====

Capture shots of your product as you build it and share them with your team.

# Installation
1. Install Node >= 10.0: http://nodejs.org/download/
2. Install RethinkDB: http://www.rethinkdb.com/docs/install/
3. Clone the repository: https://github.com/bdickason/shots
4. `cd shots; npm install`
5. Install Grunt: `sudo npm install -g grunt-cli`
6. Load the database: `rethinkdb`
7. Load the server: `node index.js`

## Projects

A project is defined by a project name.

For example: **model-edit**

A project has many shots, ordered in chronological order.

Example:

```json
{
  "name": project,
  "shots": [
      { "id": 0 },
      { "id": 1 },
      { "id": 2 },
  ]
};
```

## Shots

A Shot is a combination of text and/or images posted by a user.

A Shot may only belong to one project.

Example:

```json
{
  "id": 0,
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
```

# Running Tests

We use [mocha](http://visionmedia.github.io/mocha/) for our server-side tests.

To run the test suite type:
`grunt tests` from the base project directory

Do not push to `master` with failing tests. `master` must always be deployable (but not deplorable).

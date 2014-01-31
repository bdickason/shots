shots
=====

Capture shots of your product as you build it and share them with your team.

# Installation
1. Install Node >= 10.0: http://nodejs.org/download/
2. Install RethinkDB: http://www.rethinkdb.com/docs/install/
3. Clone the repository: https://github.com/bdickason/shots
4. `cd shots; npm install`
5. Load the database: `rethinkdb`
6. Load the server: `node index.js`

## Projects

A project is defined by a project name.

For example: **model-edit**

A project has many shots, ordered in chronological order.

## Shots

A Shot is a combination of text and images posted by a user.

A Shot may only belong to one project.
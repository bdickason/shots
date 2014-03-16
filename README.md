shots
=====

Capture shots of your product as you build it and share them with your team.

[![Build Status](https://secure.travis-ci.org/bdickason/shots.png)](http://travis-ci.org/bdickason/shots)

# Installation
1. Install Node >= 10.0: http://nodejs.org/download/
2. Clone the repository: https://github.com/bdickason/shots
3. Instal dependencies: `cd shots; npm install`
4. Install Grunt: `sudo npm install -g grunt-cli`
5. Build .js and run tests: `grunt`
6. Load the server: `node index.js`
7. Visit the site in your browser: http://localhost:3000/

## Projects

A project is defined by a project name.

For example: **wall thickness**

Example: https://shots.firebaseio.com/projects.json

```json
{
  "wall thickness": {
    "id": "wall thickness"
  }
}
```

A project has many shots, ordered in chronological order.


## Shots

A Shot is a combination of text and/or images posted by a user.

A Shot may only belong to one project.

Example: curl https://shots.firebaseio.com/shots/wall%20thickness/.json

```json
{
  "-JGQQotCb7K3SPp2_3Qr": {
    "text": "Working on a new version of the wall thickness fixer",
    "user": "bdickason",
    "timestamp": 1393103425102,
    "time": "a few seconds ago",
    "image": "http://lh3.ggpht.com/_FhgfYmXyBPs/S_aa_E3A_kI/AAAAAAAAEG8/IYfVkF8Ra0M/cloud%20cosplay_thumb%5B1%5D.jpg?imgmax=800",
    "projectId": "wall thickness",
    "id":"-JGQQotCb7K3SPp2_3Qr"
  }
}
```

# Browserify

We use [browserify](http://browserify.org/) for our frontend module system. It's similar to `npm` but runs on the client.

Browserify compiles all .js into `app/lib/bundle.js`.

All modules are included via the `require` command and app.js is the entry point.

While working, I suggest using `grunt watch` to re-build any js files that change while you're working.


# Running Tests

We deleted the server, so I need to figure out how tests will work.

To run the test suite type:
`grunt tests` from the base project directory

Do not push to `master` with failing tests. `master` must always be deployable (but not deplorable).

*Coming soon: Browser tests!*


# Contributing

## As a Designer

Fork the repository, follow the above steps for setting up a repo, and go!

CSS files lives in [/app/sass](app/sass) and are compiled via the command `grunt`. I suggest running `grunt watch` while working, which will rebuild the css files any time you make a change. (Behind the scenes it's running `compass watch`)


## As a Developer

Fork the repository, follow the above steps for setting up a repo, and go!

See also:
* [Architecture](docs/architecture.md)
* [Patterns](docs/patterns.md)
* [Event Tracking](docs/tracking.md)
* [Testing](docs/testing.md)
* [Committing](docs/committing.md)

# License

Shots is governed by the MIT License. For more information see the LICENSE file.


# FAQ

**Q: I'm geting an error when running npm install: 'Error: EMFILE, too many open files'**

A: Your operating system has a limit on the number of files that can be open at any time. To resolve this, you can use the command: `ulimit -n 10480`

For more information: http://superuser.com/questions/261023/how-to-change-default-ulimit-values-in-mac-os-x-10-6

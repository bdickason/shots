testing
-------

# Testing Philosophy

* All functions should have unit test coverage
* Standalone pages should have integration test coverage
* Any bug reports should become a test case


# Running Tests

We use [Mocha](http://visionmedia.github.io/mocha/) for our tests with [Should](https://github.com/visionmedia/should.js/) assertions. Tests are executed from our [Gruntfile](/Gruntfile.js) via the following command:

`grunt tests`

This will run through the test suite and display any failing tests.


# Writing Tests

All test files should be named `:componentName.spec.js`. For example, if you're writing a test for Shots, it should be named `shots.spec.js.`

*Client* tests are located in `/test/app` and include coverage for the presence of dependencies, unit tests for functions and events, and integration tests.

**Client tests may eventually be moved into individual component folders like `shots` or `projects` for modularity.**

*Server* tests are located in `/test/server` and test things like server routes and configuration variables.
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

## Testing functions that reference external libraries

In a perfect world, every function/object only references itself and is loosely coupled to other objects/functions. Unfortunately this is not the case in our app :(

We use [sinon](http://sinonjs.org) to allow us to test external services without the app calling out to the actual service. This keeps tests fast and prevents us from mucking up live data with tests.

For example, let's say you're testing a function that uses FirebaseSimpleLogin:

````
module.exports = Backbone.Model.extend({
    initialize: function() {
      /* Authentication via Twitter/Firebase */
      var fbRef = new Firebase(app.fbUrl);
      var model = this;

      /* Firebase auth library, triggered on sign in/sign out */
      app.auth = new FirebaseSimpleLogin(fbRef, function(error, user) {

        if(user) {
          // Login was successful
          this.model.set(user);
        }
      });
    }
});
````

First, you need to deal with the Firebase dependency. In the 'beforeEach' function in your .spec.js file, you'll create a stub (or fake version) of the object.

````
beforeEach(function(done) {
fbStub = sinon.stub(global, 'Firebase');  
});
````

In other words, fbStub represents a stub method of the function located at: global.Firebase. This will stub the entire Firebase library and allow us to bypass it.

Next, we need to stub out the FirebaseSimpleLogin object:

````
beforeEach(function(done) {
fbStub = sinon.stub(global, 'Firebase');  
loginStub = sinon.stub(global, 'FirebaseSimpleLogin');
});
````

So now we have two fake objects and our tests will no longer complain that `'Firebase' does not exist`.

This lets our tests pass but doesn't get us what we want: A 'working' copy of FirebaseSimpleLogin that can pretend a real user is authenticated.

For that, we use the `yield` parameter of sinon. Yield lets you override the output of the first callback triggered by the sinon object.

In our case, it's triggered when we call `new FirebaseSimpleLogin` in our function above. The function takes two parameters: `(error, user)` so we can use this knowledge to assemble our `yield` parameters:

````
     // Input
      var input = {
        displayName: 'User Name',
        profile_image_url_https: 'http://blah.com/img.jpg',
        lastLogin: new Date(),
        username: 'username',
        loggedIn: true
      };

      loginStub.yields(null, input);  // FirebaseSimpleLogin will generate a callback which contains these two parameters
````

We've created a dummy set of input data and used the `loginStub.yield(null, input)` function to tell the `new FirebaseSimpleLogin` function to use null and our `input` object when a callback is triggered!

This passes `input` into our function in place of the `user` variable and lets us access it within the function to verify that everything looks good.

The final step now is to make sure we clean up the stub in case future functions actually need the normal Firebase or FirebaseSimpleLogin functions:

````
  afterEach(function() {
    fbStub.restore();
    loginStub.restore();
  });
````

This will restore each function to its original state, and now we can test our dependent functions!
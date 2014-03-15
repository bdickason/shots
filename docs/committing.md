committing code
===============

So you've started digging into the codebase and you want to contribute! That's awesome.

Here are a few guidelines to get started:


# Work In a Branch

Never develop on `master`. 

Create a branch with a name that clearly represents your feature. For example if you're adding the ability to edit comments, you can create a branch called **edit-comments**:

`git checkout -b edit comments`

You can merge in new updates to the original project by adding a remote called 'upstream':

`git remote add --track master upstream git://github.com/bdickason/shots.git`


# Always Write Tests

Writing tests for Shots is pretty damn easy. Any functionality you're adding can fit into our test framework. 

We will not accept a commit whose tests don't pass.

Read More: [Testing](./testing.md)


# Open a Pull Request

If you have an idea, have been hacking for a bit and need feedback, or have something to contribute, **Open a Pull Request**!!

A Pull Request gives us a shared canvas to take a look at your code, share feedback, collaborate, and ultimately merge it into a project.

Think of it like your way to shoehorn code directly into the codebase!

We'll review every pull request that comes in and comment or merge immediately.

Please make sure to run tests (see: [Testing](./testing.md)) before submitting your pull request.


Interested to learn more about how to make great contributions?

1. Check out this guide on 'How to Github': https://gun.io/blog/how-to-github-fork-branch-and-pull-request/

2. Ask a question in our [Discussion area](http://discuss.braddickason.com/)
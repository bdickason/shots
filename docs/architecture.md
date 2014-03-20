Architecture
============

Shots is primarily a javascript app run in the browser. The server only exists to serve the required javascript files and the basic html container [client.handlebars](/server/views/client.handlebars).

# File Structure

````
/app
 |_ /components - Re-usable pieces of the app, categorized by function
    |_ /component1
      |_ /show - Displays a single object
      |_ /list - Displays a list of many objects
      |_ /create - Creates a new object
      |_ /edit - Edits the current object
    |_ /component2
 |_ /sass - css files
 |_ app.js - The main app loaderresides here
 |_ routes.js - Determines which URL's go where

/docs - You're reading them!

/server
|_ /cfg - Environment variables
|_ /static - This directory is served by the server for css/js/etc
  |_ /css - All css is compiled into this folder via `grunt watch`
  |_ /images - Place any images here
  |_ /lib - All javascript is compiled into this folder via `grunt watch`
|_ /views - Template to render the main index.html goes here
|_ index.js - Loads the server

/test
|_ /app - Client-side tests go here
|_ /helpers - Helper functions to make tests work properly
|_ /server - Server-side tests go here
 ````

# Backbone - Renders components/models

Backbone is the core of the app and has four core components:
Routes - If a user visits /projects/213 it knows which Views to render
Models - Store and retrieve data from the server (i.e. a project or a comment)
Collections - Groups of models (i.e. projects or comments)
Views - Loads Models and Collections and contains functions to manipulate the data and render it in a template.
Templates (.hbs) - Contain the actual html and variables to render the view.


# Browserify - Client-side modular .js

In traditional Javascript development, you would add a bunch of `<script>` tags to your page with a ton of different variables and functions and hope for the best. You had to pay close attention to the order in which things were loaded, unique names, etc.

[Browserify](http://www.browserify.com) takes the nodejs-style `require('component.js')` syntax and makes it available on the client. This lets you do cool things like:

````
var CommentModel = require('comments/commentModel.js');
var comment = new CommentModel({id: '26'});
comment.get('author');
````

In other words, you can load any javascript file and reference it like an object.

Browserify also compiles the .js into a single file called `bundle.js` as part of our `grunt watch` process (see below).


# Compass - CSS Authoring Framework

[Compass](http://compass-style.org/) allows you to use variables and other shortcuts to write better CSS. It uses a format called .scss and lives in the `/app/sass` directory. We use sass for all css in the app.

Compass compiles the .scss into a single file called `screen.css` as part of our `grunt watch` process (see below).


# Grunt - Task Runner

[Grunt](http://gruntjs.com/) lets you execute tasks from the command line such as running tests or compiling javascript/compass files.

To see the different Grunt commands we have available, check out the [Gruntfile](/Gruntfile.js) in the root directory.


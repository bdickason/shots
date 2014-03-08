Patterns Used
=============

# Firebase Collections/models

When loading a Collection that contains many Models, the Collection should extend `Backbone.Firebase.Collection` and the Model should extend `Backbone.Model`. 

When loading a single Model, the model should extend `Backbone.Firebase.Model`. 


# Embedded Views using Backbone

Sometimes you want to render a few different pieces of content that are related on a single page. One way to do this is to initialize everything from a route, but you can also use the embedded views pattern:

Say you have a view for a single Project which contains many Shots. A user can add a new shot or click on any of the shots to navigate to a single Shot view.
(insert pic of embedded view model)

1. Route loads the outer view (collection optional)

````
project: function(project) {
    // (/:projectName) - Loads a single project
    
    // Display a single project
    var projectModelFirebase = new ProjectModelFirebase({id: project});
    var projectView = new ProjectView({model: projectModelFirebase});

    this.showView('content', projectView);
};
````

2. Outer view loads the inner view as part of the Initialize function:

````
 initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.shotsCollectionFirebase = new ShotsCollectionFirebase([], {project: this.model.get('id')});
    this.shotsView = new ShotsView({ collection: this.shotsCollectionFirebase, project: this.model.get('id')});
  },
````

3. Outer view attaches the inner view to the proper element

````
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    this.$el.find('.shots').html(this.shotsView.render().el);
    return this;
  }
````

4. Inner views always return 'this' on render and delegates events

````
 render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
````

# Links and URL's within the navigation

The current URL represents a state within the application.

When creating a new URL or linking somowhere, you need to do two things:

1. In the **View**: Use app.router to navigate the user to their destination

Backbone uses a simple Javascript routing system to send users around the app. The routes are defined in [routes.js](/app/routes.js).

To create a link, you should create a click handler with an associated functionin your View.

````javascript
  events: {
    'click #shotlink': 'gotoShot'
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('projectId') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});
  }
````

The event calls the function `gotoShot` when `.shotlink` is clicked.

`gotoShot` navigates to the shot by constructing the proper route and sending the user there.

*Note: we use `e.preventDefault()` to stop the link from clicking through.

In your associated template file (.hbs), you would also want to make sure you have an `<a class="shotlink">` for the user to click on.

example: [nav/navView.js](/app/components/nav/navView.js)

2. In the **Template**: Construct the proper URL in case they want to copy it to the clipboard.

If you've read through Step 1, you've got a working link and probably think you're done. Wrong! :D

The link by default will not have a valid href parameter. This doesn't matter for passing users around our app, but if they want to share the link anywhere, it matters!

A simplified version of the same logic you use in your `gotoShot` function above should also be present in the template (.hbs).

````
<a href="/{{ projectId }}/{{ id }}" id="shotlink">Shot Link</a>
````

example: [nav/navTemplate.hbs](/app/components/nav/navTemplate.hbs)
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
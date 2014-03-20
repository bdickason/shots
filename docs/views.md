Working with Views
==================

We use [MarionetteJS](https://github.com/marionettejs/backbone.marionette/tree/master/docs) on top of [BackboneJS](http://backbonejs.org/) to provide Views for our app.

A View is responsible for passing data from a controller into a template and rendering that template. A View should also capture events (clicks, etc) on DOM elements and pass them to the Controller.

# Types of Views

### ItemView

Use an ItemView if you're only displaying a single item or you want to pull aggregate information from a collection. An ItemView takes a model and can be called from a CollectionView or CompositeView.

ItemViews should also be used if you're creating static content that have no models/collections associated with them.

[ItemView Docs](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md)


### CollectionView

Use a CollectionView if you need to display a single, repeated collection without a standalone template. A CollectionView will loop over the collection and render each model in an ItemView.

[CollectionView Docs](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.collectionview.md)


### CompositeView

Use a CompositeView if you need to display a collection as well as additional information. A CompositeView can have a collection associated with it along with a model. For example, a Shot (model) with many comments (collection).

[CompositeView Docs](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.compositeview.md)



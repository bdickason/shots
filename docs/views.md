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


## Where are these `<div>`'s coming from?!

Each View creates a DOM object that we use to render the template (.hbs) inside of. By default, the tag used is `<div>` which explains why you might see some random `<div>` tags in the page source that you didn't expect.

There is no way to disable this functionality, but you can overide the type of tag, the id, or the classname to do what you want to accomplish. Here's how:

Each View has a series of variables or functions that define how it works.

For example:
[shotShowView.js](/app/components/shots/show/shotShowView.js)
````
module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: shotShowTemplate,
  className: 'shot',
  id: function() {
    // Sets the id= of our <li>
    return(this.model.get('id'));
  },
````

You can add, edit, and remove these variables as long as they follow standard [JSON](http://en.wikipedia.org/wiki/JSON) notation.


### Tag Type

To set the type of tag used by a view, use the `tagName` parameter.

`tagName` will place whatever type of tag you want inside angle brackers (`<` and `>`) when rendering the view. This allows you to use any valid HTML element as the parent container for your view.

Make sure you include quotes around the tagname like `'li'` or `'div'` or `'span'`.

By default, `tagName` will render a `<div>`.


### CSS Class

To set the class(es) used by a view, use the `className` parameter.

This will place whatever you type into the string into the `class="blah"` parameter of the parent DOM element.

You can add many class names here, just like you would when writing HTML.

Make sure you include quotes around the tagname like `'li'` or `'div'` or `'span'`.

By default, no classes will be applied to your element.

### CSS ID

To set the id used by a view, use the `id` parameter.

This will place whatever you type into the string into the `id="blah"` parameter of the parent DOM element.

For example: `id: 'nav'`

If you want to access dynamic data from the object, you can get fancy. and use a `function()` call to access data from the model.

For example:

````
  id: function() {
    // Sets the id= of our <li>
    return(this.model.get('id'));
  },
````

This will set the id of the DOM element to the id of our model (in this case a shot).
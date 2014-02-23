/* utils - Utility functions */

module.exports.close = function(view) {
    // Removes all reference to a view (avoids memory leaks)
    if(view.model) {
        // View has a model, unbind change events
        view.model.unbind("change", view.modelChanged);
    }

    view.remove();
    view.unbind();
};

module.exports.debug = function(e, results) {
    // spits out whatever event is fired
    // Usage (within a view): this.listenTo(this.model, 'all', app.utils.debug);
    console.log(e);
    console.log(results);
};

// Handlebars helper for plural variables
// Use: {{pluralize object 'single_string' 'plural_string'}}
//
// Example: "0 comments" vs. "1 comment" vs. "5 comments"
// {{pluralize this.length "comment" "comments" }}
// Assumes the collection is being loaded as 'this'

app.Handlebars.registerHelper('pluralize', function(number, singular, plural) {
    switch(number) {
        case 0:
            return(plural);
        case 1:
            return(singular);
        default:
            return(plural);
    }
});
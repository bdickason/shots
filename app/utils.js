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

module.exports.debug = function(e) {
    // spits out whatever event is fired
    // Usage (within a view): this.listenTo(this.model, 'all', app.utils.debug);
    console.log(e);
};
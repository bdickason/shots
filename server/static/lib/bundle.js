(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Main app js file */

app = {};

window.onload = function(){
    Backbone.$ = window.$;

    app.utils = require('./utils.js');

    var Routes = require('./routes.js');

    app.router = new Routes(); // Routes control the app and start everything up, depending on location
    Backbone.history.start();
};


},{"./routes.js":5,"./utils.js":6}],2:[function(require,module,exports){
/* Projects Collection - An ordered list of Projects */
var ProjectModel = require('../models/projectModel.js');

module.exports = Backbone.Collection.extend({
    model: ProjectModel,
    url: '/api/projects',
    initialize: function() {
      this.fetch();
    }
  });
},{"../models/projectModel.js":3}],3:[function(require,module,exports){
/* Project Model - data layer for a single Project */

module.exports = Backbone.Model.extend({
  urlRoot: '/api/projects',
  initialize: function() {
  },
    defaults: {
      text: ''
    }
  });

},{}],4:[function(require,module,exports){
/* Shot Model - data layer for a single Shot */
module.exports = Backbone.Model.extend({
    urlRoot: function() {
        return('/api/projects/' + this.instanceUrl);
    },
    initialize: function() {
        this.instanceUrl = this.get('projectId');
    },
    defaults: {
      text: ''
    }
  });

},{}],5:[function(require,module,exports){
/* Routes - Contains all routes for client-side app */

var NavView = require('./views/navView.js');
var ProjectNavView = require('./views/projectNavView.js');
var ProjectsView = require('./views/projectsView.js');
var ProjectView = require('./views/projectView.js');
var ShotView = require('./views/shotView.js');
var SingleShotView = require('./views/singleShotView.js');

var ProjectsCollection = require('./collections/projectsCollection.js');

var ProjectModel = require('./models/projectModel.js');
var ShotModel = require('./models/shotModel.js');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        ':project/:shot(/)': 'shot',    // the (/) catches both :shot and :shot/
        ':project(/)': 'project',
    },
    home: function(params) {
        // Default Route (/) - Display a list of the most recently updated projects
        console.log('Route: /');

        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el); // Currently necessary because views persist after a new route is visited

        // Display list of latest projects
        projectsCollection = new ProjectsCollection();
        var projectsView = new ProjectsView({collection: projectsCollection});
        $('content').html(projectsView.$el);

    },
    project: function(project) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + project);
        
        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el);

        // Display a single project
        projectModel = new ProjectModel({id: project});
        var projectView = new ProjectView({model: projectModel});
        $('content').html(projectView.$el);
    },
    shot: function(project, shot) {
        // (/:projectName/shotName) - Loads a single shot
        console.log('[shot]: /#' + project + '/' + shot);

        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el);

        // Display 'project' sub-navigation
        projectModel = new ProjectModel({id: project});
        var projectNav = new ProjectNavView(projectModel);
        navView.$el.after(projectNav.$el);

        // Display a single shot
        shot = new ShotModel({id: shot, projectId: project});   // We need to use projectId because project is used elsewhere
        var singleShotView = new SingleShotView({model: shot});
        $('content').html(singleShotView.$el);
    }
});
},{"./collections/projectsCollection.js":2,"./models/projectModel.js":3,"./models/shotModel.js":4,"./views/navView.js":7,"./views/projectNavView.js":8,"./views/projectView.js":9,"./views/projectsView.js":10,"./views/shotView.js":11,"./views/singleShotView.js":13}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
/* Nav View - Renders the navigation */

var navTemplate = require('./templates/navTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: navTemplate,

  initialize: function() {
    this.render();
  },

  events: {
    'click #home': 'gotoHome'
  },

  render: function() {
    this.$el.html(this.template()); // Nav has no collection associated with it, so just render the tepmlate
    return this;
  },

  gotoHome: function(e) {
    // Navigate to the homepage
    // Can't figure out how to pass an empty route to Backbone to get it to the homepage
    /*
    e.preventDefault(); // Have to disable the default behavior of the anchor

    route = " ";
    console.log(app.router);
    app.router.navigate(route, {trigger: true}); */
  }
});

},{"./templates/navTemplate.hbs":14}],8:[function(require,module,exports){
/* projectNav View - Renders a sub-nav for a specific project */

var projectNavTemplate = require('./templates/projectNavTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectNavTemplate,

  initialize: function() {
    this.render();
  },

  events: {
    'click #project': 'gotoProject'
  },

  render: function() {
    this.$el.html(this.template({ id: this.id })); // Nav has no collection associated with it, so just render the tepmlate
    return this;
  },

  gotoProject: function(e) {
    // Navigate to the Project page
    
    e.preventDefault(); // Have to disable the default behavior of the anchor

    route = this.id;
    app.router.navigate(route, {trigger: true});

    app.utils.close(this);
  }
});

},{"./templates/projectNavTemplate.hbs":15}],9:[function(require,module,exports){
/* Project View - displays a single projects */

var projectTemplate = require('./templates/projectTemplate.hbs');

var ShotsView = require('../views/shotsView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.model.fetch();
    //this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    if(this.model.get('shots')) {
      shots = this.model.get('shots');
      shotsView = new ShotsView(shots);
    }

    return this;
  }
});

},{"../views/shotsView.js":12,"./templates/projectTemplate.hbs":16}],10:[function(require,module,exports){
/* Projects View - displays all projects active within the system */

var projectsTemplate = require('./templates/projectsTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectsTemplate,

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();
  },

  events: {
    'click .project a': 'gotoProject'
  },

  render: function() {
    this.$el.html(this.template(this.collection.toJSON()));
    return this;
  },

  gotoProject: function(e) {
    // Navigate to a specific project
    e.preventDefault(); // Have to disable the default behavior of the anchor

    projectId = e.target.id;
    route = projectId;

    app.router.navigate(route, {trigger: true});
  }
});

},{"./templates/projectsTemplate.hbs":17}],11:[function(require,module,exports){
/* Shot View - displays a shot module embedded inside another page */

var shotTemplate = require('./templates/shotTemplate.hbs');

var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.View.extend({

  template: shotTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();  // Data is passed in, so we don't need to call a URL
  },

  events: {
    'click .shotlink': 'gotoShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('project') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});

  },
  debug: function(e) {
    console.log(e);
  }
});

},{"../models/shotModel.js":4,"./templates/shotTemplate.hbs":18}],12:[function(require,module,exports){
/* Shots View - displays a list of shots */

var ShotModel = require('../models/shotModel.js');
var ShotView = require('../views/shotView.js');

module.exports = Backbone.View.extend({
    el: '.shots',

    initialize: function() {
      this.render();
    },

    render: function() {
      // Display each shot in a list
      _.each(shots, function(shot) {
        var shotModel = new ShotModel(shot);
        var shotView = new ShotView({model: shotModel});
        this.$el.append(shotView.el);
      }, this);

    }
  });

},{"../models/shotModel.js":4,"../views/shotView.js":11}],13:[function(require,module,exports){
/* Shot View - displays a single shot by itself on a page */

var shotTemplate = require('./templates/shotTemplate.hbs');

var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.View.extend({

  template: shotTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    console.log('got here');
    this.model.fetch();
  },

  events: {
    'click .shotlink': 'gotoShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('project') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});

  },
  debug: function(e) {
    console.log(e);
  }
});

},{"../models/shotModel.js":4,"./templates/shotTemplate.hbs":18}],14:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "  <a href=\"/\" id=\"home\">Home</a> | New Project";
  });

},{"hbsfy/runtime":26}],15:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "  <a href=\"#\" id=\"project\">&lt;- ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " </a>";
  return buffer;
  });

},{"hbsfy/runtime":26}],16:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "  <div class=\"view\">\n    <h1>";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n\n    <ul class=\"shots\">\n    </ul>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":26}],17:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <li class=\"project\"><a href=\"#\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></li>\n      ";
  return buffer;
  }

  buffer += "  <div class=\"view\">\n    <ul>\n      ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  </div> ";
  return buffer;
  });

},{"hbsfy/runtime":26}],18:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"shot\">\n    <a href=\"/#";
  if (helper = helpers.project) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.project); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"shotlink\" id=\"";
  if (helper = helpers.project) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.project); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Shot ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    <a href=\"http://twitter.com/";
  if (helper = helpers.author) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.author); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">";
  if (helper = helpers.author) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.author); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    <p>";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n    <img src=\"";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n</li>";
  return buffer;
  });

},{"hbsfy/runtime":26}],19:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":20,"./handlebars/exception":21,"./handlebars/runtime":22,"./handlebars/safe-string":23,"./handlebars/utils":24}],20:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":21,"./utils":24}],21:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],22:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":20,"./exception":21,"./utils":24}],23:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],24:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":23}],25:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":19}],26:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":25}]},{},[1])
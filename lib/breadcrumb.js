String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


var getRouteByName = function(name) {
  //XXX: We use a private variable here, FlowRouter may change and bork this variable as much as they like which might break the entire package
  //TODO: Request a public variable way of getting this map?
  return FlowRouter._routesMap[name];
};
var enrichRouteObject = function(routeName, isCurrent, variables) {
  // replace all parameters in the title
  var routeOptions = getRouteByName(routeName) && getRouteByName(routeName).options;
  var title = (routeOptions && routeOptions.hasOwnProperty('title')) ? routeOptions.title : FlowRouter.options.title;
  if ('function' === typeof title)
    title = _.bind(title, FlowRouter.current())();
  console.log(_.extend(FlowRouter.current().params,variables),FlowRouter.current().params,variables);
  var params = _.extend(FlowRouter.current().params,variables);
  if (title) {
    for (var i in params) {
      title = title && title.replace(
        new RegExp((':'+i).replace(/\+/g, "\\+"), "g"), params[i]);
    }
    if (routeOptions.slug)
      title = title.split(routeOptions.slug).join(' ');
    if (!getRouteByName(routeName).options.noCaps)
      title = title && title.capitalize();
  } else {
    title = null;
  }

  if(isCurrent) {
    cssClasses = 'active';
  } else {
    cssClasses = '';
  }

  if (title) return {
    'routeName': routeName,
    'params': params,
    'title': title,
    'cssClasses': cssClasses,
    'url': FlowRouter.path(routeName,FlowRouter.current().params,FlowRouter.current().queryParams),
    'route': getRouteByName(routeName)
  }
}

var getAllParents = function(variables) {
  if(FlowRouter.current().route) {
    var current = FlowRouter.current().route.name;
    var parent = getRouteByName(FlowRouter.current().route.name).options.parent;
    if ('function' === typeof parent)
      parent = _.bind(parent, FlowRouter.current())()

    if(parent) {
      return getParentParent([enrichRouteObject(current,true,variables),enrichRouteObject(parent,false,variables)],variables);
    } else {
      return [enrichRouteObject(current,false,variables)];
    }
  } else {
    // no routes have been specified
    return [];
  }

}

// parents must be always an array
var getParentParent = function(parents,variables) {
  var lastParent = parents[parents.length-1];
  if(newParent = (lastParent && getRouteByName(lastParent.routeName).options.parent)) {
    if ('function' === typeof newParent) {
      newParent = _.bind(newParent, FlowRouter.current())()
    }
    parents.push(enrichRouteObject(newParent,false,variables))
    return getParentParent(parents,variables);
  } else {
    return parents;
  }
}

Breadcrumb = {
  getAll: function(variables) {
    FlowRouter.watchPathChange();
    return _.compact(getAllParents(variables)).reverse();
  },
};

UI.registerHelper('Breadcrumb', function(template) {
  return Breadcrumb.getAll(this/* variables sended through the helper */);
});

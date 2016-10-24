meteor-breadcrumb-plugin enchanced (FlowRouter Edition)
========================

This package will provide a easy way to add a breadcrumb with more flexibility to your project.

> I made change to add dynamic variables through the breadcrumb's helper. I haven't care about performances. You can help this package to grow by verifying performance then open a ticket or make a pull request.

# Current Issues

* It current utilizes a private variable within FlowRouter which may cause it to break on FlowRouter updates.( I'll submit an issue about this once the other issues are resolved)

# The demo is [here](https://github.com/Buom01/meteor-breadcrumb-plugin/tree/master/examples/)

# Dependencies

* Flow-Router >=2.0
* Meteor >1.0

# Compatibility

* works out of the box with bootstrap3
* use the pre existing template or use your own

# Installation

Use `meteor add buom01:flow-router-breadcrumb` to add the package to your meteor app

# Usage

* You need to add two parameters to your flow routes which are `parent` and `title`

## 1. Example Flow Router with multiple levels

### In this example the Breadcrumb would look or the url `/dashboard/analytics/books` like: `Dashboard / Analytics / Category Books`

```
// Level 0
FlowRouter.route('/', {
  name: 'dashboard',
  title: 'Dashboard'
});

// Level 1
FlowRouter.route('/dashboard/analytics', {
  name: 'dashboard.analytics',
  parent: 'dashboard', // this should be the name variable of the parent route
  title: 'Analytics'
});

// Level 2
FlowRouter.route('/dashboard/analytics/books', {
  name: 'dashboard.analytics.books',
  parent: 'dashboard.analytics', // this should be the name variable of the parent route
  title: 'Category Books'
});
```

## 2. Example Dynamic Flow Route

### In this example the Breadcrumb would look for the url `/post/hello-world` like: `Home / Blogpost Hello-World`

```
FlowRouter.route('/', {
  name: 'home',
  template: 'home',
  title: 'Home'
});

FlowRouter.route('/post/:_name', {
  name: 'post',
  parent: 'home', // this should be the name variable of the parent route
  title: 'Blogpost :_name' // the variable :_name will be automatically replaced with the value from the url of by the variable provided in the template
});
```

## 3. Example use of the de-slugify feature
```
It's a common thing to provide a slug of a title/name of document in route. This leads to breadcrumb in a form:

level 1 > My-awesome-title > level 3
What we usually want is for that to look like:

level 1 > My Awesome Title > level 3

If You specify the slug parameter in your route configuration like this:

title: ':param',
slug: '-'
```
Then all the '-' characters in the title will be changed into ' ' and the title will get capitalized as usual.

# 4. Don't forget the waiting time
If you use data provided by the template to the breadcrumb you will probably see `undefined` while data are loading. So use helpers to send `[Loading...]` instead of an undefined variable.
`{{> breadcrumb myvar=(load myDynamicLoadingVar)}}`

```
Template.registerHelper('load', function(content){
  if(content) return content;
  return '[Loading...]';
});
```

## Example custom template for navigation

### Please note, that you dont have to use a custom template with the name `breadcrumb`, you can use the existing one out of the box by simply using `{{> breadcrumb}}` or `{{> breadcrumb foo=bar}}` to include the preexisting template, with any variables for texts, anywhere in your own templates. It looks exact like the following example:

```
<template name="breadcrumb">
    <ol class="breadcrumb">
        {{#each Breadcrumb}}
            <li class="{{cssClasses}}"><a href="{{url}}">{{title}}</a></li>
        {{/each}}
    </ol>
</template>
```

## Example access of the breadcrumb in Javascript

```
if (Meteor.is_client) {
  Template.analytics.rendered = function(){
    console.log(Breadcrumb.getAll()); // you can access the breadcrumb objects in a template helper as well
  }
}
```

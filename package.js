Package.describe({
  name: 'buom01:flow-router-breadcrumb',
  summary: 'This package will provide a easy way to add a breadcrumb to FlowRouter with more flexibility.',
  version: '1.1.0',
  git: 'https://github.com/rfox90/meteor-breadcrumb-plugin/'
});

function configurePackage(api) {

  // Core Dependencies
  api.use(
    [
      'blaze@2.0.0',
      'templating@1.0.5',
      'underscore@1.0.4',
      'meteor@1.1.10'
    ]
  );

  api.use('kadira:flow-router@2.8.0', 'client');
  api.addFiles('lib/breadcrumb.html',['client']);
  api.addFiles('lib/breadcrumb.js',['client']);

  api.export('Breadcrumb');
}

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  configurePackage(api);

  api.use('tinytest');
  api.addFiles('tests/breadcrumb-tests.js');
});

'use strict';

var app = angular.module("app", [
  "ngResource",
  "ui.router",
  "ui.bootstrap",
  "ui.select2",
  "ui.layout"
]);

app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
  // default redirects
  $urlRouterProvider.when("/admin", "/admin/users");
  $urlRouterProvider.when("/dashboard", "/admin/users");

  $stateProvider
  .state("dashboard", {
    url: "/dashboard",
    template : "---"
  })
  .state('reports', {
    url: '/reports',
    templateUrl: function (stateParams) {
      return '/app/reports';
    },
    controller: 'ReportsController'
  })
  .state('reports.report', {
    url: '/:report{id:(?:/[^/]+)?}?q',
    templateUrl: function (stateParams) {
      return '/reports/' + stateParams.report
    },
    controller: 'ReportsController'
  })
  .state('app', {
    url: '/:app',
    templateUrl: function (stateParams) {
      return '/app/' + stateParams.app;
    },
    controller: 'AppController'
  })
  .state('app.index', {
    url: '/:url',
    templateUrl: function (stateParams) {
      return '/tpl/' + stateParams.url + '?app=' + stateParams.app;
    },
    controller: 'AppIndexController'
  })
  .state('app.index.new', {
    url: '/new',
    templateUrl: function (stateParams) {
      return '/tpl/' + stateParams.url + '/new?app=' + stateParams.app;
    },
    controller: 'AppFormController'
  })
  .state('app.index.search', {
    url: '/search?query',
    templateUrl: function (stateParams) {
      return '/tpl/' + stateParams.url + '/search?app=' + stateParams.app;
    },
    controller: 'AppSearchController'
  })
  .state('app.index.edit', {
    url: '/:id/edit',
    templateUrl: function (stateParams) {
      return '/tpl/' + stateParams.url + '/' + stateParams.id + '/edit?app=' + stateParams.app;
    },
    controller: 'AppFormController'
  })
  .state('app.index.show', {
    url: '/:id',
    templateUrl: function (stateParams) {
      return '/tpl/' + stateParams.url + '/:id?app=' + stateParams.app;
    },
    controller: 'AppFormController'
  });
  $urlRouterProvider.otherwise("/dashboard");

}]);

app.config(["$httpProvider", function(provider) {
  provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
}]);

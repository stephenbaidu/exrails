'use strict';

var app = angular.module("app", [
  "ngResource",
  "ui.router",
  "ui.bootstrap",
  "ui.select2",
  "ui.layout"
]);

app.constant('APP', {
  root: '/',
  tplPrefix: '/tpl/',
  apiPrefix: '/api/',
  modules: {
    admin: { text: "Admin Center", url: "admin", dropdown: true, 
      links: [
        { text: "Users", url: "users", icon: "fa fa-users" },
        { text: "Roles", url: "roles", icon: "fa fa-sort-numeric-asc" }
      ]
    },
    reports:  {
      text: "Reports", url: "reports", icon: "glyphicon glyphicon-stats",
      links: [
        { text: "Users",      url: "users",      icon: "fa fa-files-o" },
        { text: "Roles",      url: "roles",      icon: "fa fa-clipboard" },
        { text: "Role Users", url: "role_users", icon: "fa fa-clipboard" }
      ]
    }
  }
});

app.config(['$urlRouterProvider', '$stateProvider', 'APP', function ($urlRouterProvider, $stateProvider, APP) {
  // default redirects
  $urlRouterProvider.when("/admin", "/admin/users");

  $stateProvider
  .state("dashboard", {
    url: "/dashboard",
    template : "---"
  })
  .state('reports', {
    url: '/reports',
    templateUrl: function (stateParams) {
      return APP.root + 'app/reports';
    },
    controller: 'ReportsController'
  })
  .state('reports.report', {
    url: '/:report{id:(?:/[^/]+)?}?q',
    templateUrl: function (stateParams) {
      return APP.root + 'reports/' + stateParams.report
    },
    controller: 'ReportsController'
  })
  .state('app', {
    url: '/:app',
    templateUrl: function (stateParams) {
      return APP.root + 'app/' + stateParams.app;
    },
    controller: 'AppController'
  })
  .state('app.index', {
    url: '/:url',
    templateUrl: function (stateParams) {
      return APP.tplPrefix + stateParams.url + '?app=' + stateParams.app;
    },
    controller: 'AppIndexController'
  })
  .state('app.index.new', {
    url: '/new',
    templateUrl: function (stateParams) {
      return APP.tplPrefix + stateParams.url + '/new?app=' + stateParams.app;
    },
    controller: 'AppFormController'
  })
  .state('app.index.search', {
    url: '/search?query',
    templateUrl: function (stateParams) {
      return APP.tplPrefix + stateParams.url + '/search?app=' + stateParams.app;
    },
    controller: 'AppSearchController'
  })
  .state('app.index.edit', {
    url: '/:id/edit',
    templateUrl: function (stateParams) {
      return APP.tplPrefix + stateParams.url + '/' + stateParams.id + '/edit?app=' + stateParams.app;
    },
    controller: 'AppFormController'
  })
  .state('app.index.show', {
    url: '/:id/show',
    templateUrl: function (stateParams) {
      return APP.tplPrefix + stateParams.url + '/:id?app=' + stateParams.app;
    },
    controller: 'AppFormController'
  })
  .state('app.view', {
    url: '/:url/:view?q',
    templateUrl: function (stateParams) {
      return APP.tplPrefix + stateParams.url + '/' + stateParams.view + '?app=' + stateParams.app;
    }
  });
  $urlRouterProvider.otherwise("/dashboard");

}]);

app.config(["$httpProvider", function(provider) {
  provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
}]);

'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */
var app = angular.module('angularApp', [
  'ngAnimate',
  'ngAria',
  'ngCookies',
  'ngMessages',
  'ngResource',
  'ngRoute',
  'ui.router',
  'ngSanitize',
  'ngTouch',
  'ng-token-auth',
  'angular-underscore',
  'ui.bootstrap',
  'ui.select',
  'pascalprecht.translate',
  'schemaForm'
]);

app.constant('APP', {
  root: '/',
  tplPrefix: '/tpl/',
  apiPrefix: '/api/',
  modules: {
    main: {
      text: 'Main Menu', url: 'app', icon: 'fa fa-home fa-lg',
      links: [
        { text: 'Samples', url: 'samples', icon: 'glyphicon glyphicon-user' }
      ]
    },
    reports:  {
      text: 'Reports', url: 'reports', icon: 'glyphicon glyphicon-stats',
      links: [
        { text: 'Samples', url: 'samples', icon: 'fa fa-clipboard' }
      ]
    },
    setups: {
      text: 'Setups', url: 'setups', icon: 'fa fa-cogs fa-lg',
      links: [
        { text: 'Users', url: 'users', icon: 'fa fa-user' },
        { text: 'Sample Status', url: 'sample-statuses', icon: 'fa fa-tags' }
      ]
    }
  }
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('/app', '/app/dashboard'); // Default route
  $urlRouterProvider.when('/app/main', '/app/main/samples');
  $urlRouterProvider.when('/app/reports', '/app/reports/samples');
  $urlRouterProvider.when('/app/setups', '/app/setups/sample-statuses');
  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'views/layouts/login.html',
      controller: 'MainCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'views/layouts/app.html',
      controller: 'AppCtrl',
      resolve: {
        auth: function($auth, $state, $rootScope) {
          return $auth.validateUser()
            .then(function(data) {
              $rootScope.currentUser = data;
            })
            .catch(function(){
              // redirect unauthorized users to the login page
              $state.go('login');
            });
        }
      }
    })
    .state('app.dashboard', {
      url: '/dashboard',
      templateUrl: function (stateParams) {
        return 'views/layouts/dashboard.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.module', {
      url: '/:module',
      templateUrl: function (stateParams) {
        return 'views/layouts/' + stateParams.module + '_module.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.module.model', {
      url: '/:model',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/index.html';
      },
      controller: 'IndexCtrl'
    })
    .state('app.module.model.index', {
      url: '/index',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/index.html';
      },
      controller: 'IndexCtrl'
    })
    .state('app.module.model.new', {
      url: '/new',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/new.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.view', {
      url: '/:view',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/' + stateParams.view + '/.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.show', {
      url: '/:id/show',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/show.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.edit', {
      url: '/:id/edit',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/edit.html';
      },
      controller: 'FormCtrl'
    });
}).config(function($authProvider) {
  $authProvider.configure({
    apiUrl: '/api'
  });
}).factory('$exceptionHandler', function() {
  return function(exception, cause) {
    // exception.message += ' (caused by "' + cause + '")';
    // throw exception;
  };
});
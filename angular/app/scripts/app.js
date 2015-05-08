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
  'jlareau.pnotify',
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
    module1: {
      text: 'Main Menu', url: 'app', icon: 'fa fa-home fa-lg',
      links: [
        { text: 'Sample', url: 'samples', icon: 'glyphicon glyphicon-user' }
      ]
    },
    reports:  {
      text: 'Reports', url: 'reports', icon: 'glyphicon glyphicon-stats',
      links: [
      ]
    },
    setups: {
      text: 'Setups', url: 'setups', icon: 'fa fa-cogs fa-lg',
      links: [
      ]
    }
  }
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('/app', '/app/module1/samples'); // Default route
  $urlRouterProvider.when('/app/module1', '/app/module1/samples');
  $urlRouterProvider.when('/app/reports', '/app/reports/payslips');
  $urlRouterProvider.when('/app/setups', '/app/setups/person-statuses');
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
});


angular
  .module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
  }]).directive('carousel', [function() {
    return {};
  }]);
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
  // 'ui.bootstrap',
  'ngDialog',
  'ng-mfb',
  'ui.select',
  'xeditable',
  'daterangepicker',
  'angular-loading-bar',
  'pascalprecht.translate',
  'schemaForm',
  'formly',
  'formlyBootstrap'
]);

app.constant('APP', {
  root: '/',
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
        { text: 'Samples', url: 'samples', icon: 'fa fa-clipboard' },
        { text: 'Sample',  url: 'sample-info',  icon: 'fa fa-clipboard' }
      ]
    },
    setups: {
      text: 'Setups', url: 'setups', icon: 'fa fa-cogs fa-lg',
      links: [
        { text: 'Users', url: 'users', icon: 'fa fa-user color-red-100' },
        { text: 'New User', url: 'form/users', icon: 'color-deep-purple-300 fa fa-user' },
        { text: 'Roles', url: 'roles', icon: 'fa fa-user color-teal-500' },
        { text: 'Sample Status', url: 'sample-statuses', icon: 'fa fa-tags color-blue-grey-500' }
      ]
    }
  }
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('/', '/dashboard'); // Default route
  $urlRouterProvider.when('/main', '/main/samples');
  $urlRouterProvider.when('/reports', '/reports/samples');
  $urlRouterProvider.when('/setups', '/setups/sample-statuses');
  $stateProvider
    .state('app', {
      url: '/',
      // abstract: true,
      templateUrl: 'views/layouts/app.html',
      controller: 'AppCtrl',
      resolve: {
        auth: function($auth, $state, $rootScope) {
          return $auth.validateUser().catch(function() { $state.go('login'); });
        }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/layouts/login.html',
      controller: 'LoginCtrl'
    })
    .state('app.dashboard', {
      url: 'dashboard',
      templateUrl: function (stateParams) {
        return 'views/layouts/dashboard.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.reports', {
      url: 'reports',
      templateUrl: function (stateParams) {
        return 'views/layouts/reports_module.html';
      }
    })
    .state('app.reports.report', {
      url: '/:report',
      templateUrl: function (stateParams) {
        // return 'views/app/reports/' + stateParams.report + '.html';
        return 'views/app/reports/show.html';
      },
      controller: 'ReportCtrl'
    })
    .state('app.module', {
      url: ':module',
      templateUrl: function (stateParams) {
        return 'views/layouts/' + stateParams.module + '_module.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.module.form', {
      url: '/form',
      templateUrl: function (stateParams) {
        return 'views/layouts/form.html';
      }
    })
    .state('app.module.form.model', {
      url: '/:model',
      templateUrl: function (stateParams) {
        return 'views/app/' + stateParams.model + '/new.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.reports', {
      url: '/report',
      template: '<div ui-view></div>'
    })
    .state('app.module.reports.report', {
      url: '/:report',
      templateUrl: function (stateParams) {
        return 'views/app/reports/show.html';
      },
      controller: 'ReportCtrl'
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
    apiUrl: '/api',
    confirmationSuccessUrl:  window.location.href.split('#')[0],
  });
}).factory('$exceptionHandler', function() {
  return function(exception, cause) {
    // exception.message += ' (caused by "' + cause + '")';
    // throw exception;
  };
}).run(function(editableOptions) {
  editableOptions.theme = 'bs3';
}).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]).run(function(formlyConfig, formlyValidationMessages) {
  // formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'true';
  // formlyValidationMessages.addStringMessage('required', 'This field is required');
  formlyConfig.setType({
    name: 'ui-select',
    extends: 'select',
    templateUrl: 'views/templates/ui-select.html'
  });
  formlyConfig.setType({
    name: 'ui-select-multiple',
    extends: 'ui-select',
    templateUrl: 'views/templates/ui-select-multiple.html'
  });
  formlyConfig.setType({
    name: 'datepicker',
    extends: 'input',
    templateUrl: 'views/templates/datepicker.html'
  });
}).config(function (formlyConfigProvider) {  
  // formlyConfigProvider.setWrapper({
  //   name: 'validation',
  //   types: ['input', 'ui-select', 'datepicker'],
  //   templateUrl: 'views/templates/error-messages.html'
  // });
});

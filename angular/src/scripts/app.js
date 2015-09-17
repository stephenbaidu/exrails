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
  // 'ngAnimate',
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
  'chart.js',
  'angularFileUpload',
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
    main: [
      { text: 'Users', url: 'users', icon: 'fa fa-users color-deep-purple-300' },
      { text: 'Roles', url: 'roles', icon: 'glyphicon glyphicon-user color-red-100' },
      { text: 'UserForm', url: 'form/users', icon: 'fa fa-user color-teal-500' }
    ],
    admin: [
      { text: 'Users', url: 'users', icon: 'fa fa-briefcase color-deep-purple-300' },
      { text: 'Roles', url: 'roles', icon: 'fa fa-user color-red-100' }
    ],
    reports: [
      { text: 'User',  url: 'user_info', icon: 'fa fa-files-o color-teal-500' },
      { text: 'Users', url: 'users',     icon: 'fa fa-clipboard color-blue-grey-500' },
      { text: 'Roles', url: 'roles',     icon: 'fa fa-clipboard' }
    ]
  }
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('/', '/main');
  $stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'app/layouts/app.html',
      controller: 'AppCtrl',
      resolve: {
        auth: function($auth, $state, $rootScope) {
          return $auth.validateUser().catch(function() { $state.go('login'); });
        }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/layouts/login.html',
      // templateUrl: 'app/layouts/maintenance.html',
      controller: 'LoginCtrl'
    })
    .state('maintenance', {
      url: '/maintenance',
      templateUrl: 'app/layouts/maintenance.html'
    })
    .state('app.dashboard', {
      url: 'dashboard',
      templateUrl: function (stateParams) {
        return 'app/layouts/dashboard.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.reports', {
      url: 'reports',
      templateUrl: function (stateParams) {
        return 'app/layouts/reports_module.html';
      }
    })
    .state('app.reports.report', {
      url: '/:report',
      templateUrl: function (stateParams) {
        return 'app/components/reports/show.html';
      },
      controller: 'ReportCtrl'
    })
    .state('app.module', {
      url: ':module',
      templateUrl: function (stateParams) {
        return 'app/layouts/' + stateParams.module + '_module.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.module.form', {
      url: '/form',
      templateUrl: function (stateParams) {
        return 'app/layouts/form.html';
      }
    })
    .state('app.module.form.model', {
      url: '/:model',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/new.html';
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
        return 'app/components/reports/show.html';
      },
      controller: 'ReportCtrl'
    })
    .state('app.module.model', {
      url: '/:model',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/index.html';
      },
      controller: 'IndexCtrl'
    })
    .state('app.module.model.index', {
      url: '/index',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/index.html';
      },
      controller: 'IndexCtrl'
    })
    .state('app.module.model.new', {
      url: '/new',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/new.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.view', {
      url: '/:view',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/' + stateParams.view + '.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.show', {
      url: '/:id/show',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/show.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.edit', {
      url: '/:id/edit',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/edit.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.bulk', {
      url: '/:id/bulk/:table',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/bulk.html';
      },
      controller: 'BulkCtrl'
    })
    .state('app.module.model.uploads', {
      url: '/:id/uploads',
      templateUrl: function (stateParams) {
        return 'app/components/' + stateParams.model + '/uploads.html';
      },
      controller: 'UploadsCtrl'
    });
}).config(function($authProvider) {
  $authProvider.configure({
    apiUrl: '/api',
    confirmationSuccessUrl:  window.location.href.split('#')[0],
  });
})
.factory('auth401Interceptor', function($q, $location){
  return {
    responseError: function(rejection) {
      if (rejection.status === 401) {
        $location.path('/login');
      }
      return $q.reject(rejection);
    }
  }
}).config(function($httpProvider) {
  $httpProvider.interceptors.push('auth401Interceptor');
}).factory('$exceptionHandler', function() {
  return function(exception, cause) {};
}).run(function(editableOptions) {
  editableOptions.theme = 'bs3';
}).config(function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}).run(function(formlyConfig, formlyValidationMessages) {
  formlyConfig.setType({
    name: 'ui-select',
    extends: 'select',
    templateUrl: 'app/templates/ui-select.html'
  });
  formlyConfig.setType({
    name: 'ui-select-multiple',
    extends: 'ui-select',
    templateUrl: 'app/templates/ui-select-multiple.html'
  });
  formlyConfig.setType({
    name: 'datepicker',
    extends: 'input',
    templateUrl: 'app/templates/datepicker.html'
  });
});

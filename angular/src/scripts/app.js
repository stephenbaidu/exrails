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
  'formly',
  'formlyBootstrap'
]);

app.constant('APP', {
  root: '/',
  apiPrefix: '/api/',
  partials: {
    fab: 'app/partials/floating-action-button.html',
    filterInput: 'app/partials/filter-input.html',
    header: 'app/partials/header.html',
    searchForm: 'app/partials/search-form.html',
    indexGrid: 'app/partials/index-grid.html',
    nameGrid: 'app/partials/name-grid.html',
    loadMoreButton: 'app/partials/load-more-button.html',
    formNav: 'app/partials/form-nav.html',
    formlyForm: 'app/partials/formly-form.html',
    formNewButtons: 'app/partials/form-new-buttons.html',
    formShowButtons: 'app/partials/form-show-buttons.html',
    formEditButtons: 'app/partials/form-edit-buttons.html',
    bulkNav: 'app/partials/bulk-nav.html',
    bulkGrid: 'app/partials/bulk-grid.html',
    uploadsGrid: 'app/partials/uploads-grid.html'
  },
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
      templateUrl: function ($stateParams) {
        return 'app/layouts/dashboard.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.reports', {
      url: 'reports',
      templateUrl: function ($stateParams) {
        return 'app/layouts/reports_module.html';
      }
    })
    .state('app.reports.report', {
      url: '/:report',
      templateUrl: function ($stateParams) {
        return 'app/components/reports/show.html';
      },
      controller: 'ReportCtrl'
    })
    .state('app.module', {
      url: ':module',
      templateUrl: function ($stateParams) {
        return 'app/layouts/' + $stateParams.module + '_module.html';
      },
      controller: 'ModuleCtrl'
    })
    .state('app.module.form', {
      url: '/form',
      templateUrl: function ($stateParams) {
        return 'app/layouts/form.html';
      }
    })
    .state('app.module.form.model', {
      url: '/:model',
      templateUrl: function ($stateParams) {
        return 'app/components/' + $stateParams.model + '/new.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.reports', {
      url: '/report',
      template: '<div ui-view></div>'
    })
    .state('app.module.reports.report', {
      url: '/:report',
      templateUrl: function ($stateParams) {
        return 'app/components/reports/show.html';
      },
      controller: 'ReportCtrl'
    })
    .state('app.module.model', {
      url: '/:model',
      templateUrl: function ($stateParams) {
        return 'app/components/' + $stateParams.model + '/index.html';
      },
      controller: 'IndexCtrl'
    })
    .state('app.module.model.new', {
      url: '/new',
      templateUrl: function ($stateParams) {
        return 'app/components/' + $stateParams.model + '/new.html';
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.show', {
      url: '/:id',
      template: function ($stateParams) {
        var showPath = 'app/components/' + $stateParams.model + '/show.html';
        return "<div ui-view><div ng-include='\"" + showPath + "\"'></div></div>";
      },
      controller: 'FormCtrl'
    })
    .state('app.module.model.show.view', {
      url: '/:view',
      templateUrl: function ($stateParams) {
        return 'app/components/' + $stateParams.model + '/' + $stateParams.view + '.html';
      }
    })
    .state('app.module.model.show.bulk', {
      url: '/bulk/:table',
      templateUrl: function ($stateParams) {
        return 'app/components/' + $stateParams.model + '/bulk.html';
      },
      controller: 'BulkCtrl'
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
})
.factory('auth404Interceptor', function($q, $location, exMsg){
  return {
    responseError: function(rejection) {
      if (rejection.status === 404) {
        exMsg.sweetAlert('Invalid request', '', 'error')
      }
      return $q.reject(rejection);
    }
  }
}).config(function($httpProvider) {
  $httpProvider.interceptors.push('auth404Interceptor');
}).factory('$exceptionHandler', function() {
  return function(exception, cause) {};
}).run(function(editableOptions) {
  editableOptions.theme = 'bs3';
}).config(function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}).config(function(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'ex-input',
    templateUrl: 'app/templates/ex-input.html',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    overwriteOk: true
  });
  formlyConfigProvider.setType({
    name: 'ex-select',
    templateUrl: 'app/templates/ex-select.html',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    overwriteOk: true
  });
  formlyConfigProvider.setType({
    name: 'ex-select-multiple',
    templateUrl: 'app/templates/ex-select-multiple.html',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    overwriteOk: true
  });
  formlyConfigProvider.setType({
    name: 'ex-datepicker',
    templateUrl: 'app/templates/ex-datepicker.html',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    overwriteOk: true
  });

  formlyConfigProvider.setWrapper({
    name: 'validation',
    types: ['ex-input', 'ex-select', 'ex-select-multiple', 'ex-datepicker'],
    templateUrl: 'app/templates/error-messages.html'
  });
}).run(function run(formlyConfig, formlyValidationMessages) {
  formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
  formlyValidationMessages.addStringMessage('required', 'This field is required'); 
}).filter('whereMulti', function() {
  return function(items, key, values) {
    var out = [];
    if (angular.isArray(values)) {
      values.forEach(function(value) {
        for (var i = 0; i < items.length; i++) {
          if (value == items[i][key]) { out.push(items[i]); break; }
        }
      });
    }
    return out;
  };
});

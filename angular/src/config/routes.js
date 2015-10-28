angular.module('angularApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/', '/main');
    $stateProvider
      .state('app', {
        url: '/?q',
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
      .state('app.module.model.page', {
        url: '/p/:page',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/' + $stateParams.page + '.html';
        }
      })
      .state('app.module.model.show.bulk', {
        url: '/bulk/:table',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/bulk.html';
        },
        controller: 'BulkCtrl'
      })
      .state('app.module.model.view', {
        url: '/:id/:view',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/' + $stateParams.view + '.html';
        }
      })
      .state('app.module.model.new', {
        url: '/new',
        onEnter: function ($stateParams, $state, $uibModal) {
          $uibModal.open({
            templateUrl: 'app/components/' + $stateParams.model + '/new.html',
            size: 'lg',
            controller: 'FormCtrl'
          });
        }
      })
      .state('app.module.model.show', {
        url: '/:id',
        onEnter: function ($stateParams, $state, $uibModal) {
          $uibModal.open({
            templateUrl: 'app/components/' + $stateParams.model + '/show.html',
            size: 'lg',
            controller: 'FormCtrl'
          });
        }
      });
  })
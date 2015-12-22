angular.module('angularApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/', '/main');
    $urlRouterProvider.when('/main', '/main/dashboard');
    $urlRouterProvider.when('/admin', '/admin/dashboard');
    $urlRouterProvider.when('/reports', '/reports/dashboard');
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
      .state('app.pages', {
        url: 'pages',
        template: '<ui-view></ui-view>'
      })
      .state('app.pages.page', {
        url: '/:page',
        templateUrl: function ($stateParams) {
          return 'app/pages/' + $stateParams.page + '.html';
        }
      })
      .state('app.reports', {
        url: 'reports',
        templateUrl: 'app/modules/reports/layout.html'
      })
      .state('app.reports.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/modules/reports/dashboard.html'
      })
      .state('app.reports.report', {
        url: '/:report',
        templateUrl: 'app/modules/reports/viewer.html',
        controller: 'ReportCtrl'
      })
      .state('app.module', {
        url: ':module',
        templateUrl: function ($stateParams) {
          return 'app/modules/' + $stateParams.module + '/layout.html';
        },
        controller: 'ModuleCtrl'
      })
      .state('app.module.dashboard', {
        url: '/dashboard',
        templateUrl: function ($stateParams) {
          return 'app/modules/' + $stateParams.module + '/dashboard.html';
        }
      })
      .state('app.module.form', {
        url: '/form/:model',
        onEnter: function ($stateParams, $state, $uibModal) {
          $uibModal.open({
            templateUrl: 'app/components/' + $stateParams.model + '/new.html',
            size: 'lg'
          }).result.finally(function() {
            $state.go('^');
          });
        }
      })
      .state('app.module.model', {
        url: '/:model',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/index.html';
        }
      })
      .state('app.module.model.new', {
        url: '/new',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/new.html';
        }
      })
      .state('app.module.model.show', {
        url: '/:id',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/show.html';
        }
      })
      .state('app.module.model.newPop', {
        url: '/new/pop',
        onEnter: function ($stateParams, $state, $uibModal) {
          $uibModal.open({
            templateUrl: 'app/components/' + $stateParams.model + '/new.html',
            size: 'lg'
          }).result.finally(function() {
            $state.go('^');
          });
        }
      })
      .state('app.module.model.page', {
        url: '/p/:page',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/' + $stateParams.page + '.html';
        }
      })
      .state('app.module.model.showPop', {
        url: '/:id/pop',
        onEnter: function ($stateParams, $state, $uibModal) {
          $uibModal.open({
            templateUrl: 'app/components/' + $stateParams.model + '/show.html',
            size: 'lg'
          }).result.finally(function() {
            $state.go('^');
          });
        }
      })
      .state('app.module.model.bulk', {
        url: '/:id/bulk/:table',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/bulk.html';
        }
      })
      .state('app.module.model.view', {
        url: '/:id/:view',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/' + $stateParams.view + '.html';
        }
      });
  })
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
      .state('app.module.model.page', {
        url: '/p/:page',
        templateUrl: function ($stateParams) {
          return 'app/components/' + $stateParams.model + '/' + $stateParams.page + '.html';
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
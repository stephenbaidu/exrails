'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AppCtrl', function ($scope, $rootScope, $http, $auth, $q, $state, APP, exMsg, $stateParams, authService, stateService) {
    var vm = $scope;
    window.appCtrl = vm;
    
    $rootScope.partials = APP.partials || {};
    $rootScope.modules = APP.modules || {};

    // Force permissions to be loaded
    $auth.validateToken();
    
    $rootScope.state = stateService;
    $rootScope.hasAccess = authService.hasAccess;
    $rootScope.hasModuleAccess = authService.hasModuleAccess;

    vm.drpOptions = {
      showDropdowns: true,
      ranges: {
         'Today': [moment().startOf('day'), moment().endOf('day')],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment().endOf('day')],
         'Last 30 Days': [moment().subtract(29, 'days'), moment().endOf('day')],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
         'This Year': [moment().startOf('year'), moment().endOf('year')]
      },
      opens: 'left',
    };

    vm.drpOptionsR = {
      showDropdowns: true,
      ranges: {
         'Today': [moment().startOf('day'), moment().endOf('day')],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment().endOf('day')],
         'Last 30 Days': [moment().subtract(29, 'days'), moment().endOf('day')],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
         'This Year': [moment().startOf('year'), moment().endOf('year')]
      },
      opens: 'right',
    };

    $rootScope.error = function (error) {
      error = error || {};
      error.message  && exMsg.error(error.message, error.type || 'Error');
      error.messages && exMsg.errorSummary(error.messages);
    }

    vm.back = function () {
      $state.go('^');
    }

    vm.hasUrl = function(url) {
      return window.location.hash.indexOf(url) >= 0;
    };

    vm.buildQ = function(data) {
      return _.map(data, function (v, k) {
          return k + '.eq.' + v;
        }).join(':');
    };

    vm.splitQ = function(str) {
      var result = {};
      str.split(':').forEach(function(x){
        var arr = x.split('.eq.');
        arr[1] && (result[arr[0]] = arr[1]);
      });
      return result;
    };

    vm.showPasswordChange = function () {
      authService.showChangePassword();
    }
  });

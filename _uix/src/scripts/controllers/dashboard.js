'use strict';

/**
 * @ngdoc function
 * @name uixApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the uixApp
 */
angular.module('uixApp')
  .controller('DashboardCtrl', function (APP, $http) {
    var vm = this;

    vm.data = {};
    vm.routeName = null;

    vm.initRoute = function (routeName) {
      vm.routeName = routeName;
      vm.reload();
    }

    vm.reload = function () {
      $http.get(APP.apiPrefix + 'dashboard/' + vm.routeName)
        .success(function (data) {
          vm.data = data;
        });
    }

    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });

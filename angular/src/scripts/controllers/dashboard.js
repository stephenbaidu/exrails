'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('DashboardCtrl', function ($scope, APP, $http) {
    var vm = this;
    window.dashboardCtrl = vm;

    vm.data = {};

    vm.initRoute = function (routeName) {
      $http.get(APP.apiPrefix + 'dashboard/' + routeName)
        .success(function (data) {
          vm.data = data;
        });
    }

    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });

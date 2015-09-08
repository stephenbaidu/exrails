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
    var vm = $scope;
    window.dashboardCtrl = vm;

    vm.labels = ["January", "February", "March", "April", "May", "June", "July"];
    vm.series = ['Series A', 'Series B'];
    vm.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    vm.labels2 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales"];
    vm.data2 = [300, 100, 40, 120];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };

    vm.monthlySummary = [];
    vm.dailySummary   = [];
    vm.monthlyTotals  = {};
    vm.dailyTotals    = {};

    // $http.get(APP.apiPrefix + 'dashboard/monthly_summary')
    //   .success(function (data) {
    //     vm.monthlySummary = data;
    //     vm.monthlyTotals = {
    //       count: _.reduce(data, function(memo, num){ return memo + num.count; }, 0),
    //       total: _.reduce(data, function(memo, num){ return memo + parseFloat(num.total); }, 0)
    //     };
    //   });

    // $http.get(APP.apiPrefix + 'dashboard/daily_summary')
    //   .success(function (data) {
    //     vm.dailySummary = data;
    //     vm.dailyTotals = {
    //       count: _.reduce(data, function(memo, num){ return memo + num.count; }, 0),
    //       total: _.reduce(data, function(memo, num){ return memo + parseFloat(num.total); }, 0)
    //     };
    //   });
  });

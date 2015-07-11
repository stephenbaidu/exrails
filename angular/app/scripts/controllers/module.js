'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:ModuleCtrl
 * @description
 * # ModuleCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('ModuleCtrl', function ($scope, APP) {
    var vm = $scope;
    window.moduleCtrl = vm;

    vm.drpOptions = {
      showDropdowns: true,
      ranges: {
         'Today': [new Date(), new Date()],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), new Date()],
         'Last 30 Days': [moment().subtract(29, 'days'), new Date()],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'left',
    };
  });

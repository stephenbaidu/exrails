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
    window.moduleCtrl = $scope;
  });

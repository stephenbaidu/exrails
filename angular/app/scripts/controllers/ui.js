'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('UiCtrl', function ($scope, APP, $http, $state, $stateParams) {
    window.uiCtrl = $scope;

    $scope.$on('model:config-loaded', function(evt, scope) {
      if (!scope.model || !scope.schema) return;

      if (scope.model.name === 'User') {
        // do something
      }
    });

    $scope.$on('ui:form-updated', function(evt, scope) {
      if (scope.model.name === 'User' && $scope.user.is_admin) {
        // do something
      }
    })
  });

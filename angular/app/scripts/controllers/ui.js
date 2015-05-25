'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UiCtrl
 * @description
 * # UiCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('UiCtrl', function ($scope) {
    window.AppUiCtrl = $scope;

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

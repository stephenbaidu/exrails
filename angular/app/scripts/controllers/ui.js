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
    var vm = $scope;
    window.uiCtrl = vm;

    vm.$on('model:config-loaded', function(evt, scope) {
      if (!scope.model || !scope.schema) return;

      if (scope.model.name === 'User') {
        // do something
      }
    });

    vm.$on('ui:form-updated', function(evt, scope) {
      if (scope.model.name === 'User' && vm.user.is_admin) {
        // do something
      }
    })
  });

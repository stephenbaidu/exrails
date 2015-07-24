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

    vm.$on('model:index-config-loaded', function(evt, modelName, configData, scope) {
      if (modelName === 'User') {
        // do something
      }
    });

    vm.$on('ui:form-updated', function(evt, modelName) {
      if (modelName === 'User' && vm.user['admin?']) {
        // do something
      }
    })
  });

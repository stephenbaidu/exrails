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

    vm.hideFloatingActionButton = true;
    vm.fabActions = [];
    vm.fabMenuState = 'closed';

    vm.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      vm.hideFloatingActionButton = true;
    });

    vm.$on('fab:load-actions', function (evt, modelName, actionsConfig) {
      var icons = ['fa fa-columns', 'fa fa-link', 'fa fa-th-large', 'fa fa-file-o'];

      vm.fabActions = _.map(actionsConfig, function (action) {
        return {
          icon: action.icon || icons.pop(),
          label: action.label,
          handler: function () {
            if (action.handler) action.handler();
          }
        }
      }).reverse();

      vm.hideFloatingActionButton = false;
    });
  });

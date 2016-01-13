'use strict';

/**
 * @ngdoc function
 * @name uixApp.controller:ModuleCtrl
 * @description
 * # ModuleCtrl
 * Controller of the uixApp
 */
angular.module('uixApp')
  .controller('ModuleCtrl', function ($scope, APP, $state) {
    var vm = $scope;
    window.moduleCtrl = vm;

    vm.hideFloatingActionButton = true;
    vm.fabActions = [];
    vm.fabMenuState = 'closed';
    vm.fabMainIcon = 'fa-chevron-left';
    vm.fabMainLabel = 'Back';
    vm.fabMainAction = function () { $state.go('^'); }

    vm.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      vm.hideFloatingActionButton = true;
    });

    vm.$on('fab:load-actions', function (evt, modelName, actionsConfig, mainActionConfig) {
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

      mainActionConfig = mainActionConfig || {
        icon: 'fa-chevron-left',
        label: 'Back',
        handler: function () { $state.go('^'); }
      };
      
      vm.fabMainIcon = mainActionConfig.icon;
      vm.fabMainLabel = mainActionConfig.label;
      vm.fabMainAction = mainActionConfig.handler;

      vm.hideFloatingActionButton = false;
    });
  });

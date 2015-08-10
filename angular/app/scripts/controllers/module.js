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

    vm.partials = {
      fab: 'views/partials/floating-action-button.html',
      filterInput: 'views/partials/filter-input.html',
      header: 'views/partials/header.html',
      searchForm: 'views/partials/search-form.html',
      indexGrid: 'views/partials/index-grid.html',
      nameGrid: 'views/partials/name-grid.html',
      loadMoreButton: 'views/partials/load-more-button.html',
      formNav: 'views/partials/form-nav.html',
      formlyForm: 'views/partials/formly-form.html',
      schemaForm: 'views/partials/schema-form.html',
      formNewButtons: 'views/partials/form-new-buttons.html',
      formShowButtons: 'views/partials/form-show-buttons.html',
      formEditButtons: 'views/partials/form-edit-buttons.html'
    };

    vm.hideFloatingActionButton = true;
    vm.fabActions = [];

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

    vm.drpOptionsR = {
      showDropdowns: true,
      ranges: {
         'Today': [new Date(), new Date()],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), new Date()],
         'Last 30 Days': [moment().subtract(29, 'days'), new Date()],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'right',
    };

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

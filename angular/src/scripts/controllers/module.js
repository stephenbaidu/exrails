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
      fab: 'app/partials/floating-action-button.html',
      filterInput: 'app/partials/filter-input.html',
      header: 'app/partials/header.html',
      searchForm: 'app/partials/search-form.html',
      indexGrid: 'app/partials/index-grid.html',
      nameGrid: 'app/partials/name-grid.html',
      loadMoreButton: 'app/partials/load-more-button.html',
      formNav: 'app/partials/form-nav.html',
      formlyForm: 'app/partials/formly-form.html',
      schemaForm: 'app/partials/schema-form.html',
      formNewButtons: 'app/partials/form-new-buttons.html',
      formShowButtons: 'app/partials/form-show-buttons.html',
      formEditButtons: 'app/partials/form-edit-buttons.html',
      bulkNav: 'app/partials/bulk-nav.html',
      bulkGrid: 'app/partials/bulk-grid.html',
      uploadsGrid: 'app/partials/uploads-grid.html'
    };

    vm.hideFloatingActionButton = true;
    vm.fabActions = [];
    vm.fabMenuState = 'closed';

    vm.drpOptions = {
      showDropdowns: true,
      ranges: {
         'Today': [moment().startOf('day'), moment().endOf('day')],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment().endOf('day')],
         'Last 30 Days': [moment().subtract(29, 'days'), moment().endOf('day')],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'left',
    };

    vm.drpOptionsR = {
      showDropdowns: true,
      ranges: {
         'Today': [moment().startOf('day'), moment().endOf('day')],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment().endOf('day')],
         'Last 30 Days': [moment().subtract(29, 'days'), moment().endOf('day')],
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

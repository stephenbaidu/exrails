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

    vm.$on('model:form-config-loaded', function(evt, modelName, configData, scope) {
      if (modelName === 'Client') {
        setupClientForm(scope);

        if ($state.$current.name === 'app.module.model.new') {
          scope.record.subscriptions_attributes = [];
        }
      }
    });

    vm.$on('ui:form-updated', function(evt, modelName) {
      if (modelName === 'User' && vm.user['admin?']) {
        // do something
      }
    })

    function setupClientForm (scope) {
      scope.services = scope.schema.properties.service_ids.items;

      scope.$watch('record.service_ids', function () {
        if (!scope.record.service_ids) return;

        _.each(scope.record.service_ids, function (id) {
          var found = _.findWhere(scope.record.subscriptions_attributes, {service_id: id});
          if (found === undefined) {
            scope.record.subscriptions_attributes.push({
              service_id: id,
              subscription_status_id: 1,
              _destroy: false
            });
          } else {
            found._destroy = false;
          }
        });

        _.each(scope.record.subscriptions_attributes, function (e, i) {
          var index = scope.record.service_ids.indexOf(e.service_id);
          if (index < 0) {
            if (e.id) {
              e._destroy = true;
            } else {
              scope.record.subscriptions_attributes.splice(i, 1);
            }
          }
        });
      }, true);
    }
  });

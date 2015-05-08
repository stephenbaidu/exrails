'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('FormCtrl', function ($scope, $rootScope, APP, resourceManager, notificationService, $state, $stateParams, $http, $translate) {
    window.AppFormCtrl = $scope;
    $scope.lookups = {};
    $scope.schema  = {};
    $scope.form    = {};
    $scope.record  = {};
    $scope.action  = { loading: true, saving: false, creating: false, updating: false };

    $scope.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + $scope.model.url)
        .success(function (data) {
          $scope.lookups = data.lookups;
          $scope.schema  = data.schema;
          $scope.form    = data.form;
          $rootScope.$broadcast('model:config-loaded', $scope);
          $scope.setRecord();
        })
        .error(function(data, status, headers, config) {
          notificationService.error('error');
        });
    };

    $scope.loadRecord = function () {
      $scope.action.loading = true;
      if($stateParams.id) {
        var data = { id: $stateParams.id };
        resourceManager.get($scope.model.name, data)
          .then(function (data) {
            $scope.record = data;
            $rootScope.$broadcast('model:record-loaded', $scope);
            $scope.action.loading = false;
            $scope.$broadcast('schemaFormRedraw');
          })
          .catch(function (error) {
            $scope.error(error);
            $scope.action.loading = false;
          });
      }
    };

    $scope.setRecord = function () {
      if (!$scope.record.id && $stateParams.q) {
        _.each($scope.splitQ($stateParams.q), function (v, k) {
          $scope.record[k] = v;
        });
        $rootScope.$broadcast('model:record-set', $scope);
      }
    };

    $scope.cancel = function () {
      $scope.record = {};
      $state.go('^');
    };

    $scope.redirectBack = function () {
      $scope.record = {};
      $state.go('^');
      $scope.queryRecords();
    };

    $scope.create = function () {
      PNotify.removeAll();
      $scope.action.saving = true;
      $scope.action.creating = true;
      var data = {};
      data[$scope.model.key] = $scope.record;
      resourceManager.create($scope.model.name, data)
        .then(function (data) {
          $rootScope.$broadcast('model:record-created', $scope);
          notificationService.success($scope.schema.title + ' created successfully');
          $scope.record.id = data.id;
          $scope.action.saving = false;
          $scope.action.creating = false;
          $scope.redirectBack();
        })
        .catch(function (error) {
          $scope.error(error);
          $scope.action.saving = false;
          $scope.action.creating = false;
        });
    };

    $scope.edit = function () {
      $state.go('^.edit', {id: $stateParams.id});
    };

    $scope.update = function () {
      PNotify.removeAll();
      $scope.action.saving = true;
      $scope.action.updating = true;
      var data = { id: $stateParams.id };
      data[$scope.model.key] = $scope.record;
      resourceManager.update($scope.model.name, data)
        .then(function (data) {
          $rootScope.$broadcast('model:record-updated', $scope);
          notificationService.success($scope.schema.title + ' updated successfully');
          $scope.updateRecordInRecords(data)
          $scope.action.saving = false;
          $scope.action.updating = false;
          $scope.redirectBack();
        })
        .catch(function (error) {
          $scope.error(error);
          $scope.action.saving = false;
          $scope.action.updating = false;
        });
    };

    $scope.save = function () {
      if($stateParams.id) {
        $scope.update();
      } else {
        $scope.create();
      }
    };

    $scope.loadConfig();
    $scope.loadRecord();
  });
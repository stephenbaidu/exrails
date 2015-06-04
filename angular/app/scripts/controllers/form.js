'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('FormCtrl', function ($scope, $rootScope, APP, resourceManager, exMsg, $state, $stateParams, $http, $translate) {
    window.formCtrl = $scope;
    
    $scope.lookups = {};
    $scope.schema  = {};
    $scope.form    = {};
    $scope.record  = {};
    $scope.action  = { loading: true, saving: false, creating: false, updating: false, deleting: false };

    $scope.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + $scope.model.url)
        .success(function (data) {
          $scope.lookups = data.lookups;
          $scope.schema  = data.schema;
          $scope.form    = data.form;
          $scope.setDisableFields();
          $rootScope.$broadcast('model:config-loaded', $scope);
          $scope.setRecord();
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

    $scope.setDisableFields = function () {
      if ($state.$current.name === 'app.module.model.show') {
        angular.forEach($scope.schema.properties, function (field) {
          field.readonly = true;
        });
      }
    }

    $scope.loadRecord = function () {
      $scope.action.loading = true;

      if($stateParams.id) {
        var data = { id: $stateParams.id };
        resourceManager.get($scope.model.name, data)
          .then(function (data) {
            $scope.record = data;
            $scope.sanitizeRecord();
            $rootScope.$broadcast('model:record-loaded', $scope);
            $scope.action.loading = false;
            $scope.$broadcast('schemaFormRedraw');
          })
          .catch(function (error) {
            $scope.error(error);
            $scope.action.loading = false;
          });
      } else {
        $rootScope.$broadcast('model:record-new', $scope);
      }
    };

    $scope.sanitizeRecord = function () {
      _.each($scope.record, function (value, key) {
        if (value === null) {
          $scope.record[key] = '';
        }
      });
    }

    $scope.setRecord = function () {
      if (!$scope.record.id && $stateParams.q) {
        _.each($scope.splitQ($stateParams.q), function (v, k) {
          $scope.record[k] = v;
        });
        $rootScope.$broadcast('model:record-set', $scope);
      }
    };

    $scope.close = function () {
      $scope.record = {};
      $state.go('^');
    };

    $scope.redirectBack = function () {
      $scope.record = {};
      $state.go('^');
      $scope.queryRecords();
    };

    $scope.create = function () {
      $scope.action.saving = true;
      $scope.action.creating = true;

      var data = {};
      data[$scope.model.key] = $scope.record;
      
      resourceManager.create($scope.model.name, data)
        .then(function (data) {
          $rootScope.$broadcast('model:record-created', $scope);
          exMsg.success($scope.schema.title + ' created successfully');
          $scope.record.id = data.id;
          $scope.redirectBack();
        })
        .catch(function (error) {
          $scope.error(error);
        })
        .finally(function () {
          $scope.action.saving = false;
          $scope.action.creating = false;
        });
    };

    $scope.edit = function () {
      $state.go('^.edit', {id: $stateParams.id});
    };

    $scope.update = function () {
      $scope.action.saving = true;
      $scope.action.updating = true;

      var data = { id: $stateParams.id };
      data[$scope.model.key] = $scope.record;
      
      resourceManager.update($scope.model.name, data)
        .then(function (data) {
          $rootScope.$broadcast('model:record-updated', $scope);
          exMsg.success($scope.schema.title + ' updated successfully');
          $scope.updateRecordInRecords(data)
          $scope.redirectBack();
        })
        .catch(function (error) {
          $scope.error(error);
        })
        .finally(function () {
          $scope.action.saving = false;
          $scope.action.updating = false;
        });
    };

    $scope.save = function () {
      PNotify.removeAll();
      $scope.$broadcast('schemaFormValidate');

      if ($scope.formObject && !$scope.formObject.$valid) {
        return;
      }

      if($stateParams.id) {
        $scope.update();
      } else {
        $scope.create();
      }
    };

    $scope.delete = function () {
      $scope.action.deleting = true;

      var msg = "Are you sure you want to delete this " + $scope.schema.title + "?";
      exMsg.confirm(msg, "Confirm Delete").then(function () {
        var data = { id: $scope.record.id };
        data[$scope.model.key] = $scope.record;
        resourceManager.delete($scope.model.name, data)
          .then(function (data) {
            exMsg.success($scope.schema.title + " deleted successfully");
            $scope.reload();
            $scope.redirectBack();
          })
          .catch(function (error) {
            $scope.error(error);
          }).finally(function () {
            $scope.action.deleting = false;
          });
      }).catch(function () {
        $scope.action.deleting = false;
      });
    };

    $scope.loadConfig();
    $scope.loadRecord();
  });

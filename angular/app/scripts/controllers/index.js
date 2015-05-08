'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $http, APP, resourceManager, $filter, notificationService, byValueFilter) {
    window.AppIndexCtrl = $scope;
    $scope.grid = {};
    $scope.recordsHash = {};
    $scope.records = [];
    $scope.searchQuery = null;
    $scope.action = { loading: false };
    $scope.paging = {
      totalRecords: 0,
      recordsPerPage: 15,
      currentPage: 1,
      previousId: 0,
      currentId: 0,
      nextId: 0,
      pageSizes: [5, 10, 15, 20, 25, 30, 50, 100, 500, 1000]
    };
    $scope.model = resourceManager.register($stateParams.model, APP.apiPrefix + $stateParams.model.replace(/-/gi, '_') + '/:id');

    $scope.queryRecords = function (page, size, query) {
      if(! query) {
        query = $scope.searchQuery || {};
      }
      $scope.action.loading = true;
      query['page'] = page || $scope.paging.currentPage;
      query['size'] = size || $scope.paging.recordsPerPage;
      resourceManager.query($scope.model.name, query, function(data, totalRecords) {
          $scope.paging.totalRecords = totalRecords;
          $scope.updateRecords(data);
          $rootScope.$broadcast('model:records-loaded', $scope);
          $scope.action.loading = false;
        })
        .then(function (data) {
          // $scope.updateRecords(data);
        })
        .catch(function (error) {
          $scope.error(error);
          $scope.action.loading = false;
        });
    }

    $scope.$on('model:records-loaded', function (e, scope) {
      if(scope.model.name != $scope.model.name) return;

      $scope.updatePreviousNext();
    });

    $scope.$on('model:record-loaded', function (e, scope) {
      if(scope.model.name != $scope.model.name) return;

      $scope.paging.currentId = scope.record.id;
      $scope.updatePreviousNext();
    });

    $scope.updatePreviousNext = function () {
      if ($scope.records.length == 0 || $scope.paging.currentId == 0) return;

      var indices = $filter('previousNextIds')($scope.records, $scope.paging.currentId);
      if (indices) {
        $scope.paging.previousId = indices.previousId;
        $scope.paging.nextId = indices.nextId;
      }
    }

    $scope.fieldData = function (record, field) {
      var lookup = $scope['schema']['properties'][field]['lookup'];
      var value  = record[field];

      if (!!lookup) {
        return byValueFilter($scope.lookups[lookup], value).name;
      }

      return value;
    }

    $scope.updateRecords = function (records) {
      angular.forEach(records, function(record) {
        if (!$scope.recordsHash[record.id]) {
          $scope.records.push(record);
          $scope.recordsHash[record.id] = true;
        }
      });
    }

    $scope.updateRecordInRecords = function (record) {
      if (!record) return;
      angular.forEach($scope.records, function (rec, index) {
        if (rec.id == record.id) {
          $scope.records[index] = record;
          return;
        }
      });
    }

    $scope.loadMore = function () {
      if ($scope.records.length < $scope.paging.totalRecords) {
        $scope.paging.currentPage = $scope.paging.currentPage + 1;
        $scope.queryRecords();
      }
    }

    $scope.setSearchQuery = function (q) {
      $scope.searchQuery = q;
    }

    $scope.$watch('paging.recordsPerPage', function() {
      $scope.queryRecords();
    });

    $scope.error = function (error) {
      error = error || {};
      error.message  && notificationService.error(error.message, error.type || 'Error');
      error.messages && $rootScope.errorSummary(error.messages);
    }

    $scope.delete = function (id) {
      var msg = "Are you sure you want to Delete this " + $scope.model.title + "?";
      $rootScope.confirmDialog(msg, "Confirm Delete").then(function () {
        var data = { id: id };
        data[$scope.model.key] = $scope.record;
        resourceManager.delete($scope.model.name, data)
          .then(function (data) {
            $scope.queryRecords();
            notificationService.success($scope.model.name + " deleted successfully");
          })
          .catch(function (error) {
            $scope.error(error);
          });
      });
    };

    $scope.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + $scope.model.url)
        .success(function (data) {
          $scope.lookups = data.lookups;
          $scope.schema  = data.schema;
          $scope.grid    = data.grid;
          $rootScope.$broadcast('model:config-loaded', $scope);
          $scope.queryRecords();
        })
        .error(function(data, status, headers, config) {
          notificationService.error('error');
        });
    };

    $scope.loadConfig();
  });

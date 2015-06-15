'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $http, APP, resourceManager, $filter, exMsg, byValueFilter, reportService) {
    window.indexCtrl = $scope;
    
    $scope.grid = [];
    $scope.recordsHash = {};
    $scope.records = [];
    $scope.searchQuery = null;
    $scope.action = { loading: false, deleting: false };
    $scope.paging = {
      totalRecords: 0,
      recordsPerPage: 15,
      currentPage: 1,
      previousId: 0,
      currentId: 0,
      nextId: 0
    };
    $scope.model = resourceManager.register($stateParams.model, APP.apiPrefix + $stateParams.model.replace(/-/gi, '_') + '/:id');

    $scope.queryRecords = function (page, size, query) {
      $scope.action.loading = true;

      if(! query) {
        query = $scope.searchQuery || {};
      }
      
      query['page'] = page || $scope.paging.currentPage;
      query['size'] = size || $scope.paging.recordsPerPage;
      
      resourceManager.query($scope.model.name, query, function(data, totalRecords) {
          $scope.paging.totalRecords = totalRecords;
        })
        .then(function (data) {
          $scope.updateRecords(data);
          $rootScope.$broadcast('model:records-loaded', $scope);
        })
        .catch(function (error) {
          console.log(error);
          $scope.error(error);
        })
        .finally(function (error) {
          $scope.action.loading = false;
        });
    }

    $scope.hasCreateAccess = function () {
      return $scope.hasAccess($scope.model.name + ':create');
    }

    $scope.hasShowAccess = function () {
      return $scope.hasAccess($scope.model.name + ':show');
    }

    $scope.hasUpdateAccess = function () {
      return $scope.hasAccess($scope.model.name + ':update');
    }

    $scope.hasDeleteAccess = function () {
      return $scope.hasAccess($scope.model.name + ':delete');
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
      var property = $scope['schema']['properties'][field];
      var lookup = (property && property.lookup) || false;
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

    $scope.reload = function () {
      $scope.recordsHash = {};
      $scope.records = [];
      $scope.paging.currentPage = 1;
      $scope.queryRecords();
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
      error.message  && exMsg.error(error.message, error.type || 'Error');
      // error.messages && $rootScope.errorSummary(error.messages);
      angular.forEach(error.messages, function(value) {
        exMsg.error(value, 'Error');
      });
    }

    $scope.delete = function (id) {
      $scope.action.deleting = true;

      var msg = "Are you sure you want to delete this " + $scope.schema.title + "?";
      exMsg.confirm(msg, "Confirm Delete").then(function () {
        var data = { id: id };
        data[$scope.model.key] = $scope.record;
        resourceManager.delete($scope.model.name, data)
          .then(function (data) {
            $scope.reload();
            exMsg.success($scope.schema.title + " deleted successfully");
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

    $scope.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + $scope.model.url)
        .success(function (data) {
          $scope.lookups = data.lookups;
          $scope.schema  = data.schema;
          $scope.grid    = data.grid;
          $rootScope.$broadcast('model:config-loaded', $scope);
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

    $scope.toCSV = function () {
      var columns = _.chain($scope.grid)
        .map(function (e) {
          return {key: e, title: $scope.schema.properties[e].title}
        }).value();
      var reportData = _.map($scope.records, function (rec) {
        var data = {};
        _.each($scope.grid, function (e) {
          data[e] = $scope.fieldData(rec, e);
        });

        return data;
      });
      
      reportService.toCSV($scope.model.title, reportData, columns);
    };

    $scope.toPDF = function () {
      var columns = _.chain($scope.grid)
        .map(function (e) {
          return {key: e, title: $scope.schema.properties[e].title}
        }).value();
      var reportData = _.map($scope.records, function (rec) {
        var data = {};
        _.each($scope.grid, function (e) {
          data[e] = $scope.fieldData(rec, e);
        });

        return data;
      });
      
      reportService.toPDF($scope.model.title, reportData, columns);
    };

    $scope.loadConfig();
  });

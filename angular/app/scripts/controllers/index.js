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
    var vm = $scope;
    window.indexCtrl = vm;
    
    vm.grid = {};
    vm.recordsHash = {};
    vm.records = [];
    vm.currentRecord = {};
    vm.searchQuery = null;
    vm.action = { loading: false, deleting: false };
    vm.paging = {
      totalRecords: 0,
      recordsPerPage: 15,
      currentPage: 1,
      previousId: 0,
      currentId: 0,
      nextId: 0
    };
    vm.model = resourceManager.register($stateParams.model, APP.apiPrefix + $stateParams.model.replace(/-/gi, '_') + '/:id');

    vm.queryRecords = function (page, size, query) {
      vm.action.loading = true;

      if(! query) {
        query = vm.searchQuery || {};
      }
      
      query['page'] = page || vm.paging.currentPage;
      query['size'] = size || vm.paging.recordsPerPage;
      
      resourceManager.query(vm.model.name, query, function(data, totalRecords) {
          vm.paging.totalRecords = totalRecords;
        })
        .then(function (data) {
          vm.updateRecords(data);
          $rootScope.$broadcast('model:records-loaded', vm);
        })
        .catch(function (error) {
          console.log(error);
          vm.error(error);
        })
        .finally(function (error) {
          vm.action.loading = false;
        });
    }

    vm.hasCreateAccess = function () {
      return vm.hasAccess(vm.model.name + ':create');
    }

    vm.hasShowAccess = function () {
      return vm.hasAccess(vm.model.name + ':show');
    }

    vm.hasUpdateAccess = function () {
      return vm.hasAccess(vm.model.name + ':update');
    }

    vm.hasDeleteAccess = function () {
      return vm.hasAccess(vm.model.name + ':delete');
    }

    vm.$on('model:records-loaded', function (e, scope) {
      if(scope.model.name != vm.model.name) return;

      vm.updatePreviousNext();
    });

    vm.$on('model:record-loaded', function (e, scope) {
      if(scope.model.name != vm.model.name) return;

      vm.currentRecord = scope.record;
      vm.paging.currentId = scope.record.id;
      vm.updatePreviousNext();
    });

    vm.updatePreviousNext = function () {
      if (vm.records.length == 0 || vm.paging.currentId == 0) return;

      var indices = $filter('previousNextIds')(vm.records, vm.paging.currentId);
      if (indices) {
        vm.paging.previousId = indices.previousId;
        vm.paging.nextId = indices.nextId;
      }
    }

    vm.fieldData = function (record, field) {
      var property = $scope['schema']['properties'][field];
      var lookup = (property && property.lookup) || false;
      var value  = record[field];

      if (!!lookup) {
        return byValueFilter(vm.lookups[lookup], value).name;
      }
      
      return value;
    }

    vm.updateRecords = function (records) {
      angular.forEach(records, function(record) {
        if (!vm.recordsHash[record.id]) {
          vm.records.push(record);
          vm.recordsHash[record.id] = true;
        }
      });
    }

    vm.updateRecordInRecords = function (record) {
      if (!record) return;
      
      var recordFound = false;

      angular.forEach(vm.records, function (rec, index) {
        if (rec.id == record.id) {
          vm.records[index] = angular.copy(record);
          recordFound = true;
          return;
        }
      });

      if (!recordFound) {
        vm.records.unshift(record);
        vm.recordsHash[record.id] = true;
      }
    }

    vm.removeRecordInRecords = function (record) {
      if (!record) return;

      angular.forEach(vm.records, function (rec, index) {
        if (rec.id == record.id) {
          vm.records.splice(index, 1);
          delete vm.recordsHash[record.id];
          return;
        }
      });
    }

    vm.$on('model:record-loaded', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.updateRecordInRecords(record);
      }
    });

    vm.$on('model:record-created', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.updateRecordInRecords(record);
      }
    });

    vm.$on('model:record-updated', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.updateRecordInRecords(record);
      }
    });

    vm.$on('model:record-deleted', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.removeRecordInRecords(record);
      }
    });

    vm.reload = function () {
      vm.recordsHash = {};
      vm.records = [];
      vm.paging.currentPage = 1;
      vm.queryRecords();
    }

    vm.loadMore = function () {
      if (vm.records.length < vm.paging.totalRecords) {
        vm.paging.currentPage = vm.paging.currentPage + 1;
        vm.queryRecords();
      }
    }

    vm.setSearchQuery = function (q) {
      vm.searchQuery = q;
    }

    vm.$watch('paging.recordsPerPage', function() {
      vm.queryRecords();
    });

    vm.error = function (error) {
      error = error || {};
      error.message  && exMsg.error(error.message, error.type || 'Error');
      error.messages && exMsg.errorSummary(error.messages);
    }

    vm.delete = function (id) {
      vm.action.deleting = true;

      var msg = "Are you sure you want to delete this " + vm.schema.title + "?";
      exMsg.confirm(msg, "Confirm Delete").then(function () {
        var data = { id: id };
        data[vm.model.key] = vm.record;
        resourceManager.delete(vm.model.name, data)
          .then(function (data) {
            $rootScope.$broadcast('model:record-deleted', vm.model.name, data);
            exMsg.success(vm.schema.title + " deleted successfully");
            // vm.reload();
          })
          .catch(function (error) {
            vm.error(error);
          }).finally(function () {
            vm.action.deleting = false;
          });
      }).catch(function () {
        vm.action.deleting = false;
      });
    };

    vm.toCSV = function () {
      var columns = _.chain(vm.grid)
        .map(function (e) {
          return {key: e, title: vm.schema.properties[e].title}
        }).value();
      var reportData = _.map(vm.records, function (rec) {
        var data = {};
        _.each(vm.grid, function (e) {
          data[e] = vm.fieldData(rec, e);
        });

        return data;
      });
      
      reportService.toCSV(vm.model.title, reportData, columns);
      $rootScope.$broadcast('report:csv-generated', vm.model.name);
    };

    vm.toPDF = function () {
      var columns = _.chain(vm.grid)
        .map(function (e) {
          return {key: e, title: vm.schema.properties[e].title}
        }).value();
      var reportData = _.map(vm.records, function (rec) {
        var data = {};
        _.each(vm.grid, function (e) {
          data[e] = vm.fieldData(rec, e);
        });

        return data;
      });
      
      reportService.toPDF(vm.model.title, reportData, columns);
      $rootScope.$broadcast('report:pdf-generated', vm.model.name);
    };

    vm.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          vm.lookups = data.lookups;
          vm.schema  = data.schema;
          vm.grid    = data.grid;
          $rootScope.$broadcast('model:config-loaded', vm);
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

    vm.loadConfig();
  });

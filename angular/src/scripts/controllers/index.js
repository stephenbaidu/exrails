'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $http, APP, resourceManager, $filter, exMsg, byValueFilter, reportService, lookupService, byIdFilter, gridService) {
    var vm = $scope;
    window.indexCtrl = vm;

    vm.model = {};
    vm.modelName = null;
    vm.recordsHash = {};
    vm.records = [];
    vm.currentRecord = {};
    vm.searchQuery = null;
    vm.action = { loading: false, searching: false, deleting: false };
    vm.schema = {};
    vm.grid = [];
    vm.paging = {
      totalRecords: 0,
      recordsPerPage: 15,
      currentPage: 1,
      previousId: 0,
      currentId: 0,
      nextId: 0
    };

    vm.init = function (modelName) {
      vm.modelName = modelName;
      vm.model = resourceManager.register(modelName, APP.apiPrefix + modelName.replace(/-/gi, '_') + '/:id');
      vm.grid = gridService.get(vm.model.key);
      vm.loadConfig();
    }

    vm.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          vm.lookups = data.lookups;
          vm.schema = data.schema;
          $rootScope.$broadcast('model:index-config-loaded', vm.model.name, data, vm);
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

    vm.$on('model:do-search', function (evt, modelName, queryParams) {
      if (modelName === vm.modelName) {
        vm.recordsHash = {};
        vm.records = [];
        vm.paging.currentPage = 1;
        vm.queryRecords(1, 1000, queryParams);
      }
    });

    vm.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (!vm.state.isIndex) return;

      var actionsConfig = [];

      if (vm.hasCreateAccess()) {
        actionsConfig.push({
          icon: 'fa fa-plus',
          label: 'New ' + vm.model.name,
          handler: vm.new
        });
      }

      // Add search button
      actionsConfig.push({
        icon: 'fa fa-search',
        label: 'Search',
        handler: vm.showSearch
      });

      $rootScope.$broadcast('fab:load-actions', vm.model.name, actionsConfig);
    });

    vm.showSearch = function () {
      vm.action.searching = true;
    }

    vm.hideSearch = function () {
      vm.action.searching = false;
    }

    vm.new = function () {
      $state.go('.new');
    }

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
          $rootScope.$broadcast('model:records-loaded', vm.model.name, vm.records, vm);
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

    vm.$on('model:record-loaded', function (e, modelName, record) {
      if(vm.model.name != modelName) return;

      vm.currentRecord = record;
      vm.paging.currentId = record.id;
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

    vm.polishRecord = function (record) {
      if (!record || !record.id) return;

      lookupService.load(vm.model.key).then(function (response) {
        var lookups = response.data;
        angular.forEach(vm.schema.properties, function (value, key) {
          if (value.lookup && lookups[value.lookup]) {
            record[value.lookup] = byValueFilter(lookups[value.lookup], record[key]);
          }
        });
      });
    }

    vm.updateRecords = function (records) {
      angular.forEach(records, function(record) {
        if (!vm.recordsHash[record.id]) {
          vm.records.push(record);
          vm.recordsHash[record.id] = true;
          vm.polishRecord(record);
        }
      });
    }

    vm.updateRecordInRecords = function (record) {
      if (!record) return;

      var recordIndex = _.findIndex(vm.records, _.pick(record, 'id'));

      if (recordIndex >= 0) {
        vm.records[recordIndex] = angular.copy(record);
        vm.polishRecord(vm.records[recordIndex]);
      }
    }

    vm.removeRecordInRecords = function (record) {
      if (!record) return;

      var recordIndex = _.findIndex(vm.records, _.pick(record, 'id'));

      if (recordIndex >= 0) {
        vm.records.splice(recordIndex, 1);
        delete vm.recordsHash[record.id];
      }
    }

    vm.$on('model:record-loaded', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.updateRecordInRecords(record);
      }
    });

    vm.$on('model:record-created', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.records.unshift(angular.copy(record));
        vm.recordsHash[record.id] = true;
        vm.polishRecord(vm.records[0]);
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
          data[e] = vm.fieldData(rec, e) || '';
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
          data[e] = vm.fieldData(rec, e) || '';
        });

        return data;
      });
      
      reportService.toPDF(vm.model.title, reportData, columns);
      $rootScope.$broadcast('report:pdf-generated', vm.model.name);
    };

    if (!vm.modelName) {
      vm.init($stateParams.model);
    }
  });

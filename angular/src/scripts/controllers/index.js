'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $http, APP, resourceManager, $filter, exMsg, byValueFilter, dateFilter, reportService, lookupService, byIdFilter, gridService, authService) {
    var vm = this;
    $scope.vmRef = vm;
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

    vm.initRoute = initRoute;
    vm.queryRecords = queryRecords;
    vm.fieldData = fieldData;
    vm.polishRecord = polishRecord;
    vm.updateRecords = updateRecords;
    vm.updateRecordInRecords = updateRecordInRecords;
    vm.removeRecordInRecords = removeRecordInRecords;
    vm.reload = reload;
    vm.loadMore = loadMore;
    vm.toPDF = toPDF;
    vm.toCSV = toCSV;

    // Search related
    vm.search = { fields: [], inputType: '', params: {}, queries: {} };
    vm.initSearch = initSearch;
    vm.getQueryParams = getQueryParams;
    vm.buildSearchQueries = buildSearchQueries;
    vm.addSearchParam = addSearchParam;
    vm.clearSearchParams = clearSearchParams;
    vm.removeSearchParam = removeSearchParam;
    vm.doSearch = doSearch;

    // Reinitialize searchValue if inputType is date
    $scope.$watch('vm.search.searchField', function () {
      if (!vm.search.searchField) return;

      if (vm.search.searchField.inputType === 'date') {
        vm.search.searchValue = {startDate: moment().endOf('day'), endDate: moment().endOf('day')};
      }
    });

    $scope.$on('model:do-search', function (evt, modelName, queryParams) {
      if (modelName === vm.modelName) {
        vm.recordsHash = {};
        vm.records = [];
        vm.paging.currentPage = 1;
        vm.queryRecords(1, 1000, queryParams);
      }
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      updateFABActions();
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      updateFABActions();
    });

    $scope.$on('model:record-loaded', function (e, modelName, record) {
      if(vm.model.name != modelName) return;

      vm.currentRecord = record;
      vm.paging.currentId = record.id;
      vm.updateRecordInRecords(record);
    });

    $scope.$on('model:record-created', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.records.unshift(angular.copy(record));
        vm.recordsHash[record.id] = true;
        vm.polishRecord(vm.records[0]);
      }
    });

    $scope.$on('model:record-updated', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.updateRecordInRecords(record);
      }
    });

    $scope.$on('model:record-deleted', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.removeRecordInRecords(record);
      }
    });

    $scope.$watch('vm.paging.recordsPerPage', function() {
      vm.paging.currentPage = 1;
      vm.reload();
    });

    function initRoute (routeName, modelName) {
      vm.modelName = modelName || resourceManager.getName(routeName);
      vm.model = resourceManager.register(vm.modelName, APP.apiPrefix + routeName + '/:id');
      vm.grid = gridService.get(vm.model.key);
      loadConfig();
    }

    function loadConfig () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          vm.lookups = data.lookups;
          vm.schema = data.schema;
          vm.initSearch();
          $rootScope.$broadcast('model:index-config-loaded', vm.model.name, data, $scope);
        })
        .error(function(data, status, headers, config) {
          // exMsg.error('error');
        });
    };

    function updateFABActions () {
      if (!$scope.state.isIndex) return;

      var actionsConfig = [];
      var mainActionConfig = {};

      if (vm.hasCreateAccess()) {
        mainActionConfig = {
          icon: 'fa fa-plus',
          label: 'New ' + vm.model.name,
          handler: vm.new
        };
      }

      // Add search button
      actionsConfig.push({
        icon: 'fa fa-search',
        label: 'Search',
        handler: vm.showSearch
      });
      $rootScope.$broadcast('fab:load-actions', vm.model.name, actionsConfig, mainActionConfig);
    }

    vm.showSearch = function () {
      vm.action.searching = true;
    }

    vm.hideSearch = function () {
      vm.action.searching = false;
      vm.reload();
    }

    vm.new = function () {
      $state.go('.newPop');
    }

    function queryRecords (page, size, query) {
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
          $rootScope.$broadcast('model:records-loaded', vm.model.name, vm.records, $scope);
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
      return authService.hasCreateAccess(vm.model.name);
    }

    vm.hasShowAccess = function () {
      return authService.hasShowAccess(vm.model.name);
    }

    vm.hasUpdateAccess = function () {
      return authService.hasUpdateAccess(vm.model.name);
    }

    vm.hasDeleteAccess = function () {
      return authService.hasDeleteAccess(vm.model.name);
    }

    function fieldData (record, field) {
      var property = vm['schema']['properties'][field];
      var lookup = (property && property.lookup) || false;
      var value  = record[field];

      if (!!lookup) {
        return byValueFilter(vm.lookups[lookup], value).name;
      } else if(property.type === 'date') {
        return dateFilter(value);
      } else if(property.type === 'datetime') {
        return dateFilter(value, 'yyyy-MM-dd HH:mm:ss');
      }
      
      return value;
    }

    function polishRecord (record) {
      if (!record || !record.id) return;

      lookupService.load(vm.model.key).then(function (response) {
        var lookups = response.data;
        angular.forEach(vm.schema.properties, function (value, key) {
          if (value.lookup && lookups[value.lookup] && !record[value.lookup]) {
            record[value.lookup] = byValueFilter(lookups[value.lookup], record[key]);
          }
        });
      });
    }

    function updateRecords (records) {
      angular.forEach(records, function(record) {
        if (!vm.recordsHash[record.id]) {
          vm.records.push(record);
          vm.recordsHash[record.id] = true;
          vm.polishRecord(record);
        }
      });
    }

    function updateRecordInRecords (record) {
      if (!record) return;

      var recordIndex = _.findIndex(vm.records, _.pick(record, 'id'));

      if (recordIndex >= 0) {
        vm.records[recordIndex] = angular.copy(record);
        vm.polishRecord(vm.records[recordIndex]);
      }
    }

    function removeRecordInRecords (record) {
      if (!record) return;

      var recordIndex = _.findIndex(vm.records, _.pick(record, 'id'));

      if (recordIndex >= 0) {
        vm.records.splice(recordIndex, 1);
        delete vm.recordsHash[record.id];
      }
    }

    function reload () {
      vm.recordsHash = {};
      vm.records = [];
      vm.paging.currentPage = 1;
      vm.queryRecords();
    }

    function loadMore () {
      if (vm.records.length < vm.paging.totalRecords) {
        vm.paging.currentPage = vm.paging.currentPage + 1;
        vm.queryRecords();
      }
    }

    vm.setSearchQuery = function (q) {
      vm.searchQuery = q;
    }

    function toCSV () {
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

    function toPDF () {
      var columns = _.chain(vm.grid)
        .map(function (e) {
          return {key: e, title: vm.schema.properties[e].title}
        }).value();
      // Add no column
      columns.unshift({key: 'no', title: 'No'});
      var reportData = _.map(vm.records, function (rec, index) {
        var data = {};
        data['no'] = index + 1;
        _.each(vm.grid, function (e) {
          data[e] = vm.fieldData(rec, e) || '';
        });

        return data;
      });
      
      reportService.toPDF(vm.model.title, reportData, columns);
      $rootScope.$broadcast('report:pdf-generated', vm.model.name);
    };


    // Search related
    function initSearch () {
      vm.search.fields = _.map(vm.schema.properties, function(value, key) {
        value.key = key;
        value.inputType = 'text';

        if (value.type === 'string' && value.format === 'date') {
          value.inputType = 'date';
        } else if (value.type === 'number' && value.items) {
          value.inputType = 'select';
        }

        return value;
      });
      vm.search.dateRange = {startDate: moment().startOf('month'), endDate: moment().endOf('month')};
    }

    function getQueryParams () {
      var queryParams = _.reduce(vm.search.params, function (memo, value, key) {
        var field = _.findWhere(vm.search.fields, {key: key});
        if (!field) return memo;

        if (field.inputType === 'date') {
          memo[key + '.between'] = _.map(value, function (val) {
            return val.startDate.toISOString() + '|' + val.endDate.toISOString();
          }).join('||');
        } else if (field.inputType === 'select') {
          memo[key + '.in'] = value.join();
        } else if (field.inputType === 'text') {
          memo[key + '.like'] = value.join('|');
        }

        return memo;
      }, {});

      if (vm.search.dateRange && vm.search.dateRange.startDate) {
        var startDate = vm.search.dateRange.startDate.toISOString();
        var endDate   = vm.search.dateRange.endDate.toISOString();
        queryParams['created_at.between'] = startDate + '|' + endDate;
      }

      return queryParams;
    }

    function buildSearchQueries () {
      vm.search.queries = _.reduce(vm.search.params, function (memo, value, key) {
        var field = _.findWhere(vm.search.fields, {key: key});
        if (!field) return memo;

        var queryVal = field.title + ': ';

        if (field.inputType === 'select') {
          var vals = _.map(value, function (val) {
            var item = _.findWhere(field.items, {value: val}) || {};
            return item.label;
          });
          queryVal = queryVal + _.uniq(vals);
        } else if (field.inputType === 'date') {
          var vals = _.map(value, function (val) {
            var startDate = new Date(val.startDate).toISOString().slice(0, 10);
            var endDate   = new Date(val.endDate).toISOString().slice(0, 10);
            if (startDate === endDate) {
              return startDate;
            } else {
              return '(' + startDate + ',' + endDate + ')';
            }
          });
          queryVal = queryVal + _.uniq(vals);
        } else {
          queryVal = queryVal + _.uniq(value);
        }

        memo[key] = queryVal;
        return memo;
      }, {});
    }

    function addSearchParam () {
      if (!vm.search.searchField || !vm.search.searchValue) {
        return;
      }

      var fieldKey = vm.search.searchField.key;

      // Check if field exists in params and initialize if not
      if (!vm.search.params[fieldKey]) {
        vm.search.params[fieldKey] = [];
      }

      vm.search.params[fieldKey].push(vm.search.searchValue);

      vm.search.searchValue = null;

      vm.buildSearchQueries();
    }

    function clearSearchParams () {
      vm.search.params = {};
      vm.search.queries  = {};
    }
    
    function removeSearchParam (key) {
      delete vm.search.params[key];
      vm.buildSearchQueries();
    }
    
    function doSearch () {
      $rootScope.$broadcast('model:do-search', vm.modelName, vm.getQueryParams());
    }
  });

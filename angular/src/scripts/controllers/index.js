'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $http, APP, resourceManager, $filter, exMsg, byValueFilter, reportService, lookupService, schemaService, authService) {
    var vm = this;
    $scope.vmRef = vm;

    vm.model = {};
    vm.modelName = null;
    vm.recordsHash = {};
    vm.records = [];
    vm.currentRecord = {};
    vm.searchQuery = null;
    vm.action = { loading: false, searching: false, deleting: false };
    vm.paging = {
      totalRecords: 0,
      recordsPerPage: 15,
      currentPage: 1,
      previousId: 0,
      currentId: 0,
      nextId: 0
    };
    vm.columns = [];
    vm.classConfig = {field: '', data: ''};
    vm.collapsedColumn = {};
    vm.options = { openable: true, popable: true, collapsible: true };

    vm.initRoute = initRoute;
    vm.configure = configure;
    vm.classes = classes;
    vm.column = column;
    vm.setCollapsedColumn = setCollapsedColumn;
    vm.queryRecords = queryRecords;
    vm.columnData = columnData;
    vm.lookupData = lookupData;
    vm.updateRecords = updateRecords;
    vm.updateRecordInRecords = updateRecordInRecords;
    vm.removeRecordInRecords = removeRecordInRecords;
    vm.reload = reload;
    vm.loadMore = loadMore;
    vm.toPDF = toPDF;
    vm.toCSV = toCSV;

    // Search related
    vm.search = { fields: [], params: {}, queries: {} };
    vm.initSearch = initSearch;
    vm.getQueryParams = getQueryParams;
    vm.buildSearchQueries = buildSearchQueries;
    vm.addSearchParam = addSearchParam;
    vm.clearSearchParams = clearSearchParams;
    vm.removeSearchParam = removeSearchParam;

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      updateFABActions();
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      updateFABActions();
    });

    $scope.$on('exui:record-loaded', function (e, modelName, record) {
      if(vm.model.name != modelName) return;

      vm.currentRecord = record;
      vm.paging.currentId = record.id;
      vm.updateRecordInRecords(record);
    });

    $scope.$on('exui:record-created', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.records.unshift(angular.copy(record));
        vm.recordsHash[record.id] = true;
        setRowClass(setLookups(vm.records[0]));
      }
    });

    $scope.$on('exui:record-updated', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.updateRecordInRecords(record);
      }
    });

    $scope.$on('exui:record-deleted', function (evt, modelName, record) {
      if (vm.model.name === modelName) {
        vm.removeRecordInRecords(record);
      }
    });

    $scope.$watch('vm.paging.recordsPerPage', function() {
      vm.paging.currentPage = 1;
      vm.reload();
    });

    function initRoute (routeName, options) {
      options = options || {};
      vm.modelName = options.name || resourceManager.getName(routeName);
      window[vm.modelName + 'IndexCtrl'] = vm;
      vm.model = resourceManager.register(vm.modelName, APP.apiPrefix + routeName + '/:id');

      lookupService.load(vm.model.key, options.lookups).then(function () {
        initSearch();
        $rootScope.$broadcast('exui:index-ready', vm.model.name, vm, $scope);
      });
    }

    function configure (options) {
      vm.options = _.merge(vm.options, options);
    }

    function classes(field, data) {
      vm.classConfig = {
        field: field,
        data: data
      }
    }

    function column (name, title, filter, filterParam) {
      if (!name) return;

      title = title || _.startCase(name);

      vm.columns.push({
        name: name,
        title: title,
        filter: filter,
        filterParam: filterParam
      });

      if (!vm.collapsedColumn.name) {
        vm.collapsedColumn = _.last(vm.columns);
      }
    }

    function setCollapsedColumn (name, title, filter, filterParam) {
      if (!name) return;

      title = title || _.startCase(name);

      vm.collapsedColumn = {
        name: name,
        title: title,
        filter: filter,
        filterParam: filterParam
      };
    }

    function updateFABActions () {
      if (!$scope.state.isIndex) return;

      var actionsConfig = [];
      var mainActionConfig = {
        icon: 'fa fa-refresh',
        label: 'Reload',
        handler: vm.reload
      };

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
      $rootScope.$broadcast('fab:load-actions', vm.model.name, actionsConfig, mainActionConfig);
    }

    vm.showSearch = function () {
      vm.action.searching = true;
    }

    vm.hideSearch = function () {
      vm.action.searching = false;
      vm.paging.recordsPerPage = 15;
      vm.reload();
    }

    vm.new = function () {
      $state.go('.newPop');
    }

    function setLookups(record) {
      var properties = schemaService.get(vm.model.key).properties;
      
      if (!properties) { return record; }
      
      _.chain(properties).map(function (config, key) {
        return {
          key: key, type: config.type, lookupModel: config.lookup
        }
      }).reject(function (config) {
        return !config.lookupModel;
      }).each(function(config) {
        var propertyName = config.lookupModel + '_name';

        // pluralize field
        if (config.type === 'array') {
          propertyName = propertyName + 's';
        }

        record[propertyName] = $filter('lookup')(record[config.key], config.lookupModel);
      }).value();

      return record;
    }

    function setRowClass(record) {
      record.row_class = vm.classConfig.data[record[vm.classConfig.field]];
      return record;
    }

    function queryRecords (page, size, query) {
      vm.action.loading = true;

      if (vm.action.searching) { // in search mode
        query = vm.getQueryParams();
      } else if(! query) {
        query = vm.searchQuery || {};
      }
      
      query['page'] = page || vm.paging.currentPage;
      query['size'] = size || vm.paging.recordsPerPage;
      
      resourceManager.query(vm.model.name, query, function(data, totalRecords) {
          vm.paging.totalRecords = totalRecords;
        })
        .then(function (data) {
          vm.updateRecords(data);
          $rootScope.$broadcast('exui:records-loaded', vm.model.name, vm.records, $scope);
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

    function columnData (record, column) {
      if (!column) return '';

      var value = record[column.name];

      if (column.filter) {
        value = $filter(column.filter)(value, column.filterParam);
      }

      return value;
    }

    function lookupData(lookupName) {
      return lookupService.get(lookupName);
    }

    function updateRecords (records) {
      angular.forEach(records, function(record) {
        if (!vm.recordsHash[record.id]) {
          vm.records.push(setRowClass(setLookups(record)));
          vm.recordsHash[record.id] = true;
        }
      });
    }

    function updateRecordInRecords (record) {
      if (!record) return;

      var recordIndex = _.findIndex(vm.records, _.pick(record, 'id'));

      if (recordIndex >= 0) {
        vm.records[recordIndex] = setRowClass(setLookups(angular.copy(record)));
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
      var columns = _.chain(vm.columns)
        .map(function (e) {
          return {key: e.name, title: e.title}
        }).value();
      var reportData = _.map(vm.records, function (rec) {
        var data = {};
        _.each(vm.columns, function (e) {
          data[e.name] = vm.columnData(rec, e) || '';
        });

        return data;
      });
      
      reportService.toCSV(vm.model.title, reportData, columns);
      $rootScope.$broadcast('report:csv-generated', vm.model.name);
    };

    function toPDF () {
      var columns = _.chain(vm.columns)
        .map(function (e) {
          return {key: e.name, title: e.title}
        }).value();
      // Add number column
      columns.unshift({key: 'no', title: 'No'});
      var reportData = _.map(vm.records, function (rec, index) {
        var data = {};
        data['no'] = index + 1;
        _.each(vm.columns, function (e) {
          data[e.name] = vm.columnData(rec, e) || '';
        });

        return data;
      });
      
      reportService.toPDF(vm.model.title, reportData, columns);
      $rootScope.$broadcast('report:pdf-generated', vm.model.name);
    };


    // Search related
    function initSearch () {
      vm.search.fields = schemaService.get(vm.model.key).properties;
      // vm.search.dateRange = {startDate: moment().startOf('month'), endDate: moment().endOf('month')};
      vm.search.dateRange = {startDate: null, endDate: null};
    }

    function getQueryParams () {
      var queryParams = _.reduce(vm.search.params, function (memo, value, key) {
        var field = _.findWhere(vm.search.fields, {key: key});
        if (!field) return memo;

        if (field.format === 'date') {
          memo[key + '.between'] = _.map(value, function (val) {
            return val.startDate.toISOString() + '|' + val.endDate.toISOString();
          }).join('||');
        } else if (field.format === 'select') {
          memo[key + '.in'] = value.join();
        } else if (field.format === 'text') {
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

        if (field.format === 'select') {
          queryVal = queryVal + $filter('lookup')(value, field.lookup, true);
        } else if (field.format === 'date') {
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
  });

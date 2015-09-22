'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('SearchCtrl', function ($scope, $rootScope) {
    var vm = $scope;
    window.searchCtrl = vm;

    vm.search = { fields: [], inputType: '', params: {}, queries: {} };

    vm.$on('model:index-config-loaded', function (evt, modelName, configData) {
      vm.initSearch(configData.schema.properties);
    });

    vm.initSearch = function (schemaProperties) {
      vm.search.fields = _.map(schemaProperties, function(value, key) {
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

    // Reinitialize searchValue if inputType is date
    vm.$watch('search.searchField', function () {
      if (!vm.search.searchField) return;

      if (vm.search.searchField.inputType === 'date') {
        vm.search.searchValue = {startDate: moment().endOf('day'), endDate: moment().endOf('day')};
      }
    });

    vm.getQueryParams = function () {
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

    vm.buildSearchQueries = function () {
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

    vm.addSearchParam = function () {
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

    vm.clearSearchParams = function () {
      vm.search.params = {};
      vm.search.queries  = {};
    }

    vm.removeSearchParam = function (key) {
      delete vm.search.params[key];
      vm.buildSearchQueries();
    }

    vm.doSearch = function () {
      $rootScope.$broadcast('model:do-search', vm.modelName, vm.getQueryParams());
    }

    if (vm.schema && vm.schema.properties) {
      vm.initSearch(vm.schema.properties);
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name uixApp.controller:BulkCtrl
 * @description
 * # BulkCtrl
 * Controller of the uixApp
 */
angular.module('uixApp')
  .controller('BulkCtrl', function ($scope, $rootScope, APP, exMsg, $stateParams, $state, $http, $translate, resourceManager, schemaService, XLSXReaderService) {
    var vm = this;
    $scope.vmRef = vm;

    vm.model     = {};
    vm.routeName = null;
    vm.masterRecordId = null;
    vm.modelName = null;
    vm.action = { loading: true, saving: false, updating: false };

    vm.upload = {};
    vm.upload.matchedFields = {};
    vm.upload.matchFields = [];

    vm.initRoute = initRoute;
    vm.bulkUpload = bulkUpload;
    vm.close = close;

    $scope.$watch('vm.upload.file', function (val) {
      if (!val) return;

      vm.upload.selectedSheet = '';

      XLSXReaderService.readFile(vm.upload.file, true, true)
        .then(function (data) {
          vm.upload.data = data;
          vm.upload.selectedSheet = _.keys(data.sheets)[0];
        });
    });

    $scope.$watch('vm.upload.selectedSheet', function () {
      var rows = vm.upload.data.sheets[vm.upload.selectedSheet];
      
      if (!rows) {
        vm.upload.selectedHeaders = [];
        vm.upload.records = [];
        return;
      }

      vm.upload.selectedHeaders = _.chain(rows[0]).keys().pull('$$hashKey').value();
      vm.upload.records = rows;
      $rootScope.$broadcast('uix:bulk-automatch-fields', vm.model.name, {}, $scope);
    });

    $scope.$on('uix:bulk-automatch-fields', function (evt, modelName, config, scope) {
      if (vm.model.name !== modelName) return;

      scope.vmRef.upload.matchedFields = {};
      _.each(scope.vmRef.upload.selectedHeaders, function (title) {
        var field = _.find(scope.vmRef.upload.matchFields, function (obj) {
          return obj.title.toUpperCase() === title.toUpperCase();
        });
        if (field) {
          scope.vmRef.upload.matchedFields[title] = field.key;
        }
      });
    });

    function initRoute (routeName, options) {
      options = options || {};
      vm.routeName = routeName;
      vm.masterRecordId = $stateParams.id;
      vm.modelName = resourceManager.getName(options.table || $stateParams.table);
      // vm.modelName = resourceManager.getName(modelName || $stateParams.table);
      window[vm.modelName + 'BulkCtrl'] = vm;
      vm.model = resourceManager.register(vm.modelName, APP.apiPrefix + $stateParams.table.replace(/-/gi, '_') + '/:id');
      // loadConfig();
      vm.upload.matchFields = _.chain(schemaService.get(vm.model.key).properties)
        .map(function (value, key) {
          return { key: key, title: value.title };
        })
        .filter(function (field) {
          return (['created_at', 'updated_at'].indexOf(field.key) < 0);
        })
        .value();
      $rootScope.$broadcast('uix:bulk-view-ready', vm.model.name, {}, $scope);
    }

    function bulkUpload () {
      var data = _.map(vm.upload.records, function (record) {
        var rec = {};
        _.each(vm.upload.matchedFields, function (field, column) {
          rec[field] = record[column];
        });
        return rec;
      });
      $http.post(APP.apiPrefix + vm.routeName + '/' + vm.masterRecordId + '/' + 'bulk_upload', {
          table: vm.model.url,
          data: data
        })
        .success(function (data) {
          if (data.error) {
            exMsg.error(data.message, data.type);
          } else {
            vm.upload.data = {};
            vm.upload.selectedSheet = '';
            vm.upload.records = [];
            exMsg.success(data.length + ' records created successfully');
          }
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    }

    function close () {
      $state.go('^');
    };
  });

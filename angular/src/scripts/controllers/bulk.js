'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:BulkCtrl
 * @description
 * # BulkCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('BulkCtrl', function ($scope, $rootScope, APP, exMsg, $stateParams, $state, $http, $translate, resourceManager, XLSXReaderService) {
    var vm = this;
    $scope.vmRef = vm;
    window.bulkCtrl = vm;

    vm.model     = {};
    vm.routeName = null;
    vm.masterRecordId  = null;
    vm.modelName = null;
    vm.action = { loading: true, saving: false, updating: false };
    vm.schema = {};

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
      $rootScope.$broadcast('model:bulk-automatch-fields', vm.model.name, {}, $scope);
    });

    $scope.$on('model:bulk-automatch-fields', function (evt, modelName, config, scope) {
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

    function initRoute (routeName, modelName) {
      vm.routeName = routeName;
      vm.masterRecordId = $stateParams.id;
      vm.modelName = resourceManager.getName(modelName || $stateParams.table);
      vm.model = resourceManager.register(vm.modelName, APP.apiPrefix + $stateParams.table.replace(/-/gi, '_') + '/:id');
      loadConfig();
      vm.masterRecordId = masterRecordId;
    }

    function loadConfig () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          vm.schema = data.schema;
          vm.upload.matchFields = _.map(vm.schema.properties, function (value, key) {
            return { key: key, title: value.title };
          });
          $rootScope.$broadcast('model:bulk-config-loaded', vm.model.name, data, $scope);
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

    function bulkUpload () {
      var data = _.map(vm.upload.records, function (record) {
        var rec = {};
        _.each(vm.upload.matchedFields, function (field, column) {
          // console.log(column, record, field, rec[field]);
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

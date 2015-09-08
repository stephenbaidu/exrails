'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UploadsCtrl
 * @description
 * # UploadsCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('UploadsCtrl', function ($scope, $rootScope, APP, exMsg, $state, $stateParams, $http, $translate, resourceManager, FileUploader) {
    var vm = $scope;

    vm.uploader = new FileUploader();


    window.uploadsCtrl = vm;

    vm.model     = {};
    vm.modelName = null;
    vm.recordId  = null;
    vm.record = {};
    vm.action = { loading: true, saving: false, updating: false };
    vm.schema = {};

    vm.init = function (modelName, recordId) {
      vm.modelName = modelName;
      vm.model = resourceManager.register(modelName, APP.apiPrefix + modelName.replace(/-/gi, '_') + '/:id');
      vm.loadConfig();
      vm.recordId = recordId;
      vm.loadRecord(recordId);
    }

    vm.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          vm.schema  = data.schema;
          $rootScope.$broadcast('model:uploads-config-loaded', vm.model.name, data, vm);
          vm.setRecord();
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

    vm.loadRecord = function (recordId) {
      if(!recordId) { return; }

      vm.action.loading = true;

      var data = { id: recordId };
      resourceManager.get(vm.model.name, data)
        .then(function (data) {
          vm.record = data;
          vm.sanitizeRecord();
          $rootScope.$broadcast('model:record-loaded', vm.model.name, vm.record, vm);
          vm.action.loading = false;
        })
        .catch(function (error) {
          vm.error(error);
          vm.action.loading = false;
        });
    };

    vm.hasUpdateAccess = function () {
      return vm.hasAccess(vm.model.name + ':update');
    }

    vm.$on('model:reload-record', function(evt, modelName, record) {
      if (modelName === vm.model.name && record.id === vm.record.id) {
        vm.loadRecord(vm.record.id);
      }
    });

    vm.sanitizeRecord = function () {
      _.each(vm.record, function (value, key) {
        if (value === null) {
          vm.record[key] = '';
        }
      });
    }

    vm.setRecord = function () {
      if (!vm.record.id && $stateParams.q) {
        _.each(vm.splitQ($stateParams.q), function (v, k) {
          vm.record[k] = v;
        });
        $rootScope.$broadcast('model:record-set', vm.model.name, vm.record, vm);
      }
    };

    if (!vm.modelName) {
      vm.init($stateParams.model, $stateParams.id);
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('FormCtrl', function ($scope, $rootScope, APP, resourceManager, exMsg, $state, $stateParams, $http, $translate, fieldService, schemaService, authService, $uibModalStack) {
    var vm = this;
    $scope.vmRef = vm;

    vm.model = {};
    vm.modelName = null;
    vm.recordId = null;
    vm.record = {};
    vm.action = { editMode: false, loading: true, saving: false, creating: false, updating: false, deleting: false };
    vm.formly = { model: {}, fields: [], options: {formState: {readOnly: false}}, form: {} };

    vm.initRoute = initRoute;
    vm.loadRecord = loadRecord;
    vm.sanitizeRecord = sanitizeRecord;
    vm.setRecord = setRecord;
    vm.close = close;
    vm.create = create;
    vm.edit = edit;
    vm.cancelEdit = cancelEdit;
    vm.uploads = uploads;
    vm.update = update;
    vm.save = save;
    vm.delete = deleteRecord;

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

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (!$scope.state.isShow) return;
      
      var actionsConfig = [];
      var mainActionConfig = {};

      if (vm.hasCreateAccess()) {
        mainActionConfig = {
          icon: 'fa fa-plus',
          label: 'New ' + vm.model.name,
          handler: vm.new
        };
      }

      // Add back button
      actionsConfig.push({
        icon: 'fa fa-chevron-left',
        label: 'Back',
        handler: function () { $state.go('^'); }
      });
      $rootScope.$broadcast('fab:load-actions', vm.model.name, actionsConfig, mainActionConfig);
    });

    $scope.$on('exui:reload-record', function(evt, modelName, record) {
      if (modelName === vm.model.name && record.id === vm.record.id) {
        vm.loadRecord(vm.record.id);
      }
    });


    function initRoute (routeName, options) {
      options = options || {};
      vm.modelName = options.name || resourceManager.getName(routeName);
      window[vm.modelName + 'FormCtrl'] = vm;
      vm.model = resourceManager.register(vm.modelName, APP.apiPrefix + routeName + '/:id');
      vm.formly.fields = fieldService.get(vm.model.key);
      // loadConfig();
      
      vm.setRecord();
      $rootScope.$broadcast('exui:form-ready', vm.model.name, vm, $scope);

      var recordId = $stateParams.id;

      if (recordId) {
        vm.recordId = recordId;
        vm.loadRecord(recordId);
      }
    }

    function loadRecord (recordId) {
      if(!recordId) { return; }

      vm.action.loading = true;

      var data = { id: recordId };
      resourceManager.get(vm.model.name, data)
        .then(function (data) {
          vm.record = data;
          vm.formly.model = angular.copy(vm.record);
          vm.sanitizeRecord();
          $rootScope.$broadcast('exui:record-loaded', vm.model.name, vm.record, $scope);
          vm.action.loading = false;
          vm.formly.options.formState.readOnly = true;
        })
        .catch(function (error) {
          vm.error(error);
          vm.action.loading = false;
        });
    };

    function sanitizeRecord () {
      _.each(vm.record, function (value, key) {
        if (value === null) {
          vm.record[key] = '';
        }
      });
    }

    function setRecord () {
      if (!vm.record.id && $stateParams.q) {
        _.each(vm.splitQ($stateParams.q), function (v, k) {
          vm.record[k] = v;
        });
        $rootScope.$broadcast('exui:record-set', vm.model.name, vm.record, $scope);
      }
    };

    function close () {
      vm.record = {};
      if ($uibModalStack.getTop()) {
        $scope.$dismiss();
      }
      $state.go('^');
    };

    function create () {
      vm.action.saving = true;
      vm.action.creating = true;

      var data = {};
      data[vm.model.key] = vm.formly.model;
      
      resourceManager.create(vm.model.name, data)
        .then(function (data) {
          // vm.formly.model.id = data.id;
          vm.record = data;
          vm.formly.model = angular.copy(vm.record);
          $rootScope.$broadcast('exui:record-created', vm.model.name, data, $scope);
          exMsg.success(vm.model.title + ' created successfully');
          
          vm.close();
        })
        .catch(function (error) {
          vm.error(error);
        })
        .finally(function () {
          vm.action.saving = false;
          vm.action.creating = false;
        });
    };

    function edit () {
      vm.formly.options.formState.readOnly = false;
      vm.action.editMode = true;
    };

    function cancelEdit () {
      vm.formly.model = angular.copy(vm.record);
      vm.formly.options.formState.readOnly = true;
      vm.action.editMode = false;
    };

    function uploads () {
      $state.go('^.uploads', $stateParams);
    };

    function update () {
      if(!vm.record.id) { return; }

      vm.action.saving = true;
      vm.action.updating = true;

      var data = { id: vm.record.id };
      data[vm.model.key] = vm.formly.model;
      
      resourceManager.update(vm.model.name, data)
        .then(function (data) {
          vm.record = data;
          vm.formly.model = angular.copy(vm.record);
          $rootScope.$broadcast('exui:record-updated', vm.model.name, data, $scope);
          exMsg.success(vm.model.title + ' updated successfully');

          vm.close();
        })
        .catch(function (error) {
          vm.error(error);
        })
        .finally(function () {
          vm.action.saving = false;
          vm.action.updating = false;
        });
    };

    function save () {
      PNotify.removeAll();

      vm.formly.form.$setSubmitted(true);
      if (!vm.formly.form.$valid) {
        return;
      }

      if(vm.record.id) {
        vm.update();
      } else {
        vm.create();
      }
    };

    function deleteRecord () {
      vm.action.deleting = true;

      var msg = "Are you sure you want to delete this " + vm.model.title + "?";
      exMsg.confirm(msg, "Confirm Delete").then(function () {
        var data = { id: vm.record.id };
        data[vm.model.key] = vm.record;
        resourceManager.delete(vm.model.name, data)
          .then(function (data) {
          $rootScope.$broadcast('exui:record-deleted', vm.model.name, vm.record, $scope);
            exMsg.success(vm.model.title + " deleted successfully");
            vm.close();
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
  });

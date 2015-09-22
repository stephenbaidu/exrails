'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('FormCtrl', function ($scope, $rootScope, APP, resourceManager, exMsg, $state, $stateParams, $http, $translate, fieldService, byValueFilter) {
    var vm = $scope;
    window.formCtrl = vm;

    vm.model = {};
    vm.modelName = null;
    vm.recordId = null;
    vm.record = {};
    vm.action = { editMode: false, loading: true, saving: false, creating: false, updating: false, deleting: false };
    vm.schema = {};
    vm.formly = { model: {}, fields: [], options: {formState: {readOnly: true}}, form: {} };

    vm.init = function (modelName, recordId) {
      vm.modelName = modelName;
      vm.model = resourceManager.register(modelName, APP.apiPrefix + modelName.replace(/-/gi, '_') + '/:id');
      vm.formly.fields = fieldService.get(vm.model.key);
      vm.loadConfig();

      if (recordId) {
        vm.recordId = recordId;
        vm.loadRecord(recordId);
      }
    }

    vm.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          vm.schema = data.schema;
          $rootScope.$broadcast('model:form-config-loaded', vm.model.name, data, vm);
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
          vm.formly.model = angular.copy(vm.record);
          vm.sanitizeRecord();
          $rootScope.$broadcast('model:record-loaded', vm.model.name, vm.record, vm);
          vm.action.loading = false;
        })
        .catch(function (error) {
          vm.error(error);
          vm.action.loading = false;
        });
    };

    vm.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      var actionsConfig = [];

      if (vm.state.isNew) {
        vm.formly.options.formState.readOnly = false;
      } else if (vm.state.isShow && vm.hasCreateAccess()) {
        actionsConfig.push({
          icon: 'fa fa-plus',
          label: 'New ' + vm.model.name,
          handler: function () { $state.go('^.new') }
        });
      } else if (vm.state.isView) {
        vm.formly.options.formState.readOnly = false;
      }

      // Add back button
      actionsConfig.push({
        icon: 'fa fa-chevron-left',
        label: 'Close',
        handler: vm.redirectBack
      });
      
      $rootScope.$broadcast('fab:load-actions', vm.model.name, actionsConfig);
    });

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

    vm.close = function () {
      vm.record = {};
      $state.go('^');
    };

    vm.redirectBack = function () {
      vm.record = {};
      
      if ($state.$current.name === 'app.module.form.model') {
        $state.go('.', $stateParams, { reload: true });
      } else {
        $state.go('^');
      }
    };

    vm.create = function (redirectBack) {
      vm.action.saving = true;
      vm.action.creating = true;

      var data = {};
      data[vm.model.key] = vm.formly.model;
      
      resourceManager.create(vm.model.name, data)
        .then(function (data) {
          // vm.formly.model.id = data.id;
          vm.record = data;
          vm.formly.model = angular.copy(vm.record);
          $rootScope.$broadcast('model:record-created', vm.model.name, data, vm);
          exMsg.success(vm.schema.title + ' created successfully');
          
          if (redirectBack) {
            vm.redirectBack();
          }
        })
        .catch(function (error) {
          vm.error(error);
        })
        .finally(function () {
          vm.action.saving = false;
          vm.action.creating = false;
        });
    };

    vm.edit = function () {
      vm.formly.options.formState.readOnly = false;
      vm.action.editMode = true;
    };

    vm.cancelEdit = function () {
      vm.formly.model = angular.copy(vm.record);
      vm.formly.options.formState.readOnly = true;
      vm.action.editMode = false;
    };

    vm.uploads = function () {
      $state.go('^.uploads', $stateParams);
    };

    vm.update = function (redirectBack) {
      if(!vm.record.id) { return; }

      vm.action.saving = true;
      vm.action.updating = true;

      var data = { id: vm.record.id };
      data[vm.model.key] = vm.formly.model;
      
      resourceManager.update(vm.model.name, data)
        .then(function (data) {
          vm.record = data;
          vm.formly.model = angular.copy(vm.record);
          $rootScope.$broadcast('model:record-updated', vm.model.name, data, vm);
          exMsg.success(vm.schema.title + ' updated successfully');

          if (redirectBack) {
            vm.redirectBack();
          }
        })
        .catch(function (error) {
          vm.error(error);
        })
        .finally(function () {
          vm.action.saving = false;
          vm.action.updating = false;
        });
    };

    vm.save = function (redirectBack) {
      PNotify.removeAll();

      vm.formly.form.$setSubmitted(true);
      if (!vm.formly.form.$valid) {
        return;
      }

      if (redirectBack === undefined) {
        redirectBack = true;
      }

      if(vm.record.id) {
        vm.update(redirectBack);
      } else {
        vm.create(redirectBack);
      }
    };

    vm.delete = function () {
      vm.action.deleting = true;

      var msg = "Are you sure you want to delete this " + vm.schema.title + "?";
      exMsg.confirm(msg, "Confirm Delete").then(function () {
        var data = { id: vm.record.id };
        data[vm.model.key] = vm.record;
        resourceManager.delete(vm.model.name, data)
          .then(function (data) {
          $rootScope.$broadcast('model:record-deleted', vm.model.name, vm.record, vm);
            exMsg.success(vm.schema.title + " deleted successfully");
            vm.redirectBack();
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

    if (!vm.modelName) {
      vm.init($stateParams.model, $stateParams.id);
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('FormCtrl', function ($scope, $rootScope, APP, resourceManager, exMsg, $state, $stateParams, $http, $translate, fieldService, lookupService, formService) {
    var vm = $scope;
    window.formCtrl = vm;

    vm.model = resourceManager.register($stateParams.model, APP.apiPrefix + $stateParams.model.replace(/-/gi, '_') + '/:id');
    
    vm.record = {};
    vm.action = { loading: true, saving: false, creating: false, updating: false, deleting: false };
    
    // vm.lookups       = {};
    vm.schema        = {};
    vm.form          = formService.get(vm.model.key);

    vm.formlyFields  = fieldService.get(vm.model.key);
    vm.formlyOptions = {};
    vm.formlyForm    = {};

    vm.loadConfig = function () {
      $http.get(APP.apiPrefix + 'config/' + vm.model.url)
        .success(function (data) {
          // vm.lookups = data.lookups;
          vm.schema  = data.schema;
          // vm.form    = data.form;
          // vm.setFormFields(data.fields);
          // vm.setDisableFields();
          $rootScope.$broadcast('model:config-loaded', vm);
          vm.setRecord();
        })
        .error(function(data, status, headers, config) {
          exMsg.error('error');
        });
    };

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

    // vm.setDisableFields = function () {
    //   if ($state.$current.name === 'app.module.model.show') {
    //     angular.forEach(vm.schema.properties, function (field) {
    //       field.readonly = true;
    //     });
    //   } else {
    //     angular.forEach(vm.schema.properties, function (field) {
    //       field.readonly = false;
    //     });
    //     vm.$broadcast('schemaFormRedraw');
    //   }
    // }

    vm.loadRecord = function () {
      vm.action.loading = true;

      if($stateParams.id) {
        var data = { id: $stateParams.id };
        resourceManager.get(vm.model.name, data)
          .then(function (data) {
            vm.record = data;
            vm.sanitizeRecord();
            $rootScope.$broadcast('model:record-loaded', vm.model.name, vm.record);
            vm.action.loading = false;
            vm.$broadcast('schemaFormRedraw');
          })
          .catch(function (error) {
            vm.error(error);
            vm.action.loading = false;
          });
      } else {
        $rootScope.$broadcast('model:record-new', vm);
      }
    };

    vm.$on('model:reload-record', function(evt, model, recordId) {
      if (model === vm.model.name && recordId === vm.record.id) {
        vm.loadRecord();
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
        $rootScope.$broadcast('model:record-set', vm);
      }
    };

    vm.close = function () {
      vm.record = {};
      $state.go('^');
    };

    vm.redirectBack = function () {
      vm.record = {};
      $state.go('^');
      // vm.queryRecords();
    };

    vm.create = function () {
      vm.action.saving = true;
      vm.action.creating = true;

      var data = {};
      data[vm.model.key] = vm.record;
      
      resourceManager.create(vm.model.name, data)
        .then(function (data) {
          $rootScope.$broadcast('model:record-created', vm.model.name, data);
          exMsg.success(vm.schema.title + ' created successfully');
          vm.record.id = data.id;
          vm.redirectBack();
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
      $state.go('^.edit', {id: $stateParams.id});
    };

    vm.update = function () {
      vm.action.saving = true;
      vm.action.updating = true;

      var data = { id: $stateParams.id };
      data[vm.model.key] = vm.record;
      
      resourceManager.update(vm.model.name, data)
        .then(function (data) {
          $rootScope.$broadcast('model:record-updated', vm.model.name, data);
          exMsg.success(vm.schema.title + ' updated successfully');
          // vm.updateRecordInRecords(data);
          vm.redirectBack();
        })
        .catch(function (error) {
          vm.error(error);
        })
        .finally(function () {
          vm.action.saving = false;
          vm.action.updating = false;
        });
    };

    vm.save = function () {
      PNotify.removeAll();
      vm.$broadcast('schemaFormValidate');

      if (vm.formObject && !vm.formObject.$valid) {
        return;
      }

      if($stateParams.id) {
        vm.update();
      } else {
        vm.create();
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
          $rootScope.$broadcast('model:record-deleted', vm.model.name, data);
            exMsg.success(vm.schema.title + " deleted successfully");
            // vm.reload();
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

    vm.loadConfig();
    vm.loadRecord();
  });

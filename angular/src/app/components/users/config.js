
angular.module('angularApp')
  .controller('UserCtrl', function ($scope, APP, $http, exMsg) {
    var vm = $scope;

    vm.$on('model:index-config-loaded', function (evt, modelName, config, scope) {
      // Do something
    });

    vm.$on('model:form-config-loaded', function (evt, modelName, config, scope) {
      // Do something
    });

    vm.$on('model:record-loaded', function (evt, modelName, record, scope) {
      if (modelName !== 'User') return;

      scope.lockUser = function () {
        scope.action.locking = true;
        $http.post(APP.apiPrefix + 'users/' + record.id + '/lock')
          .success(function (data) {
            scope.record = data;
            exMsg.success('User successfully locked');
          })
          .catch(function (error) {
            exMsg.error(error['message']);
          })
          .finally(function () {
            scope.action.locking = false;
          });
      }

      scope.unlockUser = function () {
        scope.action.unlocking = true;
        $http.post(APP.apiPrefix + 'users/' + record.id + '/unlock')
          .success(function (data) {
            scope.record = data;
            exMsg.success('User successfully unlocked');
          })
          .catch(function (error) {
            exMsg.error(error['message']);
          })
          .finally(function () {
            scope.action.unlocking = false;
          });
      }

      scope.resetPassword = function () {
        //
      }
    });
  });

angular.module('angularApp')
  .run(function (gridService, fieldService) {
    // Set grid config
    gridService.set('user', gridConfig());

    // Set config for angular-formly
    fieldService.set('user', fieldConfig());

    function gridConfig () {
      return ['name', 'email', 'current_sign_in_at', 'current_sign_in_ip', 'roles'];
    }
    
    function fieldConfig () {
      return [
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "name",
              "type": "ex-input",
              "templateOptions": {
                "required": true,
                "label": "Name"
              }
            },
            {
              "className": "col-xs-6",
              "key": "email",
              "type": "ex-input",
              "templateOptions": {
                "required": true,
                "label": "Email"
              }
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "password",
              "type": "ex-input",
              "templateOptions": {
                "type": "password",
                "required": true,
                "label": "Password"
              },
              "hideExpression": "model.id"
            },
            {
              "className": "col-xs-6",
              "key": "password_confirmation",
              "type": "ex-input",
              "templateOptions": { 
                "type": "password",
                "required": true,
                "label": "Password Confirmation"
              },
              "hideExpression": "model.id"
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "sign_in_count",
              "type": "ex-input",
              "templateOptions": {
                "required": true,
                "label": "Sign In Count"
              },
              "hideExpression": "!(model.id && formState.readOnly)"
            },
            {
              "className": "col-xs-6",
              "key": "failed_attempts",
              "type": "ex-input",
              "templateOptions": {
                "required": true,
                "label": "Failed Attempts"
              },
              "hideExpression": "!(model.id && formState.readOnly)"
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "current_sign_in_at",
              "type": "ex-datepicker",
              "templateOptions": {
                "required": true,
                "label": "Current Sign In At"
              },
              "hideExpression": "!(model.id && formState.readOnly)"
            },
            {
              "className": "col-xs-6",
              "key": "last_sign_in_at",
              "type": "ex-datepicker",
              "templateOptions": {
                "required": true,
                "label": "Last Sign In At"
              },
              "hideExpression": "!(model.id && formState.readOnly)"
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "current_sign_in_ip",
              "type": "ex-datepicker",
              "templateOptions": {
                "required": true,
                "label": "Current Sign In IP"
              },
              "hideExpression": "!(model.id && formState.readOnly)"
            },
            {
              "className": "col-xs-6",
              "key": "last_sign_in_ip",
              "type": "ex-datepicker",
              "templateOptions": {
                "required": true,
                "label": "Last Sign In IP"
              },
              "hideExpression": "!(model.id && formState.readOnly)"
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-12",
              "key": "role_ids",
              "type": "ex-select-multiple",
              "templateOptions": {
                "required": false,
                "label": "Roles",
                "lookup": "role",
                "placeholder": "Select roles ...",
                "valueProp": "value",
                "labelProp": "name",
                "options": []
              },
              "controller": /* @ngInject */ function($scope, lookupService) {
                lookupService.load('user', 'role').then(function() {
                  $scope.to.options = lookupService.get('user', $scope.to.lookup);
                });
              }
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "enforce_confirmation",
              "type": "checkbox",
              "templateOptions": {
                "required": false,
                "label": "Enforce Confirmation"
              },
              "hideExpression": "model.id"
            }
          ]
        }
      ];
    }
  });

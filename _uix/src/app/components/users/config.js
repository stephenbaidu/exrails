
angular.module('uixApp')
  .controller('UserIndexCtrl', function ($scope, APP, $http, exMsg) {
    
    $scope.$on('exui:index-ready', function (evt, modelName, config, scope) {
      if (modelName !== 'User') return;
      // Do something
    });
  });

angular.module('uixApp')
  .controller('UserFormCtrl', function ($scope, APP, $http, exMsg) {

    $scope.$on('exui:form-ready', function (evt, modelName, config, scope) {
      if (modelName !== 'User') return;
      // Do something
    });

    $scope.$on('exui:record-loaded', function (evt, modelName, record, scope) {
      if (modelName !== 'User') return;

      scope.vmRef.lockUser = function () {
        scope.vmRef.action.locking = true;
        $http.post(APP.apiPrefix + 'users/' + record.id + '/lock')
          .success(function (data) {
            scope.vmRef.record = data;
            exMsg.success('User successfully locked');
          })
          .catch(function (error) {
            exMsg.error(error['message']);
          })
          .finally(function () {
            scope.vmRef.action.locking = false;
          });
      }

      scope.vmRef.unlockUser = function () {
        scope.vmRef.action.unlocking = true;
        $http.post(APP.apiPrefix + 'users/' + record.id + '/unlock')
          .success(function (data) {
            scope.vmRef.record = data;
            exMsg.success('User successfully unlocked');
          })
          .catch(function (error) {
            exMsg.error(error['message']);
          })
          .finally(function () {
            scope.vmRef.action.unlocking = false;
          });
      }

      scope.vmRef.resetPassword = function () {
        //
      }
    });
  });

angular.module('uixApp')
  .run(function (fieldService) {
    // Set config for angular-formly
    fieldService.set('user', fieldConfig());
    
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
                  $scope.to.options = lookupService.get($scope.to.lookup);
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

angular.module('uixApp')
  .run(function (schemaService) {
    // Set config for json-schema
    schemaService.set('user', schemaConfig());
    
    function schemaConfig () {
      return {
        "type": "object",
        "title": "User",
        "required": [
          "name",
          "email"
        ],
        "properties": {
          "name": {
            "key": "name",
            "title": "Name",
            "type": "string",
            "format": "text"
          },
          "email": {
            "key": "email",
            "title": "Email",
            "type": "string",
            "pattern": "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
            "validationMessage": "Should be a correct Email Address",
            "format": "text"
          },
          "role_ids": {
            "key": "role_ids",
            "title": "Roles",
            "type": "array",
            "default": [],
            "lookup": "role",
            "items": [],
            "format": "select"
          },
          "sign_in_count": {
            "key": "sign_in_count",
            "title": "Sign In Count",
            "type": "number",
            "format": "text"
          },
          "current_sign_in_at": {
            "key": "current_sign_in_at",
            "title": "Current Sign In At",
            "type": "datetime",
            "format": "date"
          },
          "last_sign_in_at": {
            "key": "last_sign_in_at",
            "title": "Last Sign In At",
            "type": "datetime",
            "format": "date"
          },
          "current_sign_in_ip": {
            "key": "current_sign_in_ip",
            "title": "Current Sign In Ip",
            "type": "string",
            "format": "text"
          },
          "last_sign_in_ip": {
            "key": "last_sign_in_ip",
            "title": "Last Sign In Ip",
            "type": "string",
            "format": "text"
          },
          "failed_attempts": {
            "key": "failed_attempts",
            "title": "Failed Attempts",
            "type": "number",
            "format": "text"
          },
          "locked_at": {
            "key": "locked_at",
            "title": "Locked At",
            "type": "datetime",
            "format": "date"
          },
          "password_expired_at": {
            "key": "password_expired_at",
            "title": "Password Expired At",
            "type": "datetime",
            "format": "date"
          }
        }
      };
    }
  });

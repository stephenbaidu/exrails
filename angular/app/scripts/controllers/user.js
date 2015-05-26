'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('UserCtrl', function ($scope, $rootScope, APP, notificationService, $http, $state, $stateParams) {
    window.AppUserCtrl = $scope;
    $scope.stateParams = $stateParams;
    $scope.state = $state;

    $scope.$on('model:config-loaded', function (evt, scope) {
      if (scope.model && scope.model.name === 'User') {
        scope.grid = ['name', 'email', 'current_sign_in_at', 'current_sign_in_ip', 'last_sign_in_at', 'last_sign_in_ip'];
        scope.schema.required = ['name', 'email'];
        scope.schema.properties.status = {
          title: 'Status',
          type: 'string',
          readonly: true
        };

        if ($state.$current.name === 'app.module.model.new') {
          setupNewUserForm(scope);
          $rootScope.$broadcast('ui:form-updated', scope);
        } else {
          updateUserConfig(scope);
          // $rootScope.$broadcast('ui:form-updated', scope);
        }
      }
    });

    $scope.$on('model:record-loaded', function (evt, scope) {
      if (scope.model.name !== 'User') {
        return;
      }

      scope.lockUser = function () {
        scope.action.locking = true;
        $http.post(APP.apiPrefix + 'users/' + scope.record.id + '/lock')
          .success(function (data) {
            scope.record = data;
            notificationService.success('User successfully locked');
          })
          .catch(function (error) {
            notificationService.error(error['message']);
          })
          .finally(function () {
            scope.action.locking = false;
          });
      }

      scope.unlockUser = function () {
        scope.action.unlocking = true;
        $http.post(APP.apiPrefix + 'users/' + scope.record.id + '/unlock')
          .success(function (data) {
            scope.record = data;
            notificationService.success('User successfully unlocked');
          })
          .catch(function (error) {
            notificationService.error(error['message']);
          })
          .finally(function () {
            scope.action.unlocking = false;
          });
      }

      scope.resetPassword = function () {
        //
      }
    });

    function updateUserConfig(scope) {
      var allowedProperties = [
        'sign_in_count', 'current_sign_in_at', 'last_sign_in_at',
        'current_sign_in_ip', 'last_sign_in_ip', 'failed_attempts',
        'name', 'image', 'email', 'role_ids', 'status'
      ];
      angular.forEach(scope.schema.properties, function (property, key) {
        if (allowedProperties.indexOf(key) < 0) {
          delete scope.schema.properties[key];
        }
      });

      scope.form = [{
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'name',
            fieldHtmlClass: 'input-lg'
          }]
        }, {
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'email',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'sign_in_count',
            fieldHtmlClass: 'input-lg'
          }]
        }, {
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'failed_attempts',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'current_sign_in_at',
            fieldHtmlClass: 'input-lg',
            pickadate: {
              selectYears: true,
              selectMonths: true
            }
          }]
        }, {
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'last_sign_in_at',
            fieldHtmlClass: 'input-lg',
            pickadate: {
              selectYears: true,
              selectMonths: true
            }
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'current_sign_in_ip',
            fieldHtmlClass: 'input-lg'
          }]
        }, {
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'last_sign_in_ip',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row large-tags-',
        items: [{
          type: 'section',
          htmlClass: 'col-xs-6',
          items: [{
            key: 'role_ids',
            fieldHtmlClass: 'input-lg'
          }]
        }, {
          type: 'section',
          htmlClass: 'col-xs-6',
          items: [{
            key: 'status',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }];
    }

    function setupNewUserForm (scope) {
      scope.schema.properties.password = {
        title: 'Password',
        type: 'string'
      };
      scope.schema.properties.password_confirmation = {
        title: 'Confirm Password',
        type: 'string'
      };
      scope.schema.properties.enforce_confirmation = {
        title: 'Enforce Email Confirmation',
        type: 'boolean',
        default: false
      };

      scope.form = [{
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'name',
            fieldHtmlClass: 'input-lg'
          }]
        }, {
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'email',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'password',
            type: 'password',
            fieldHtmlClass: 'input-lg'
          }]
        }, {
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'password_confirmation',
            type: 'password',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row large-tags',
        items: [{
          type: 'section',
          htmlClass: 'col-xs-12',
          items: [{
            key: 'role_ids',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        type: 'section',
        htmlClass: 'row',
        items: [{
          type: 'section',
          htmlClass: 'col-sm-6 col-xs-12',
          items: [{
            key: 'enforce_confirmation',
            fieldHtmlClass: 'input-lg'
          }]
        }]
      }, {
        "type": "conditional",
        "condition": "record.enforce_confirmation",
        "items": [
          {
            type: "help",
            helpvalue: '<div class="alert alert-info">A confirmation email will be sent to the User to confirm this account</div>'
          }
        ]
      }];
    }
  });

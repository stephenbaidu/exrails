'use strict';

/**
 * @ngdoc service
 * @name angularApp.authService
 * @description
 * # authService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('authService', function (APP, $auth, $stateParams, $http, $q, exMsg) {
    var authSVC = {
      hasAccess: function (urlOrPermission) {
        var permission = urlOrPermission || '';
        permission = permission.replace(/-/gi, '_');

        // Guess from url if not a specific permission
        if (permission.indexOf(':') < 0) {
          permission = permission.split('?')[0];
          if (permission.indexOf('/') < 0) {
            permission = permission.classify() + ':index';
          } else {
            var regExNew  = /^([A-z-_]+)\/new/gi;
            var regExForm = /^form\/([A-z-_]+)/gi;
            var regExShow = /^([A-z-_]+)\/(\d+)\/show/gi;
            var regExEdit = /^([A-z-_]+)\/(\d+)\/edit/gi;

            var matchNew  = regExNew.exec(permission)
            var matchForm = regExForm.exec(permission)
            var matchShow = regExShow.exec(permission)
            var matchEdit = regExEdit.exec(permission)

            if (matchNew) {
              permission = matchNew[1].classify() + ':create';
            } else if (matchForm) {
              permission = matchForm[1].classify() + ':create';
            } else if (matchShow) {
              permission = matchShow[1].classify() + ':show';
            } else if (matchEdit) {
              permission = matchEdit[1].classify() + ':update';
            }
          }
        }

        return (_.indexOf($auth.user.permissions, permission) >= 0);
      },
      hasCreateAccess: function (modelName) {
        return this.hasAccess(modelName + ':create');
      },
      hasShowAccess: function (modelName) {
        return this.hasAccess(modelName + ':show');
      },
      hasUpdateAccess: function (modelName) {
        return this.hasAccess(modelName + ':update');
      },
      hasDeleteAccess: function (modelName) {
        return this.hasAccess(modelName + ':delete');
      },
      hasModuleAccess: function (moduleName) {
        var module = APP.modules[moduleName];
        if (!module) {
          return false;
        }
        
        if (module.hasAccess) {
          return module.hasAccess($auth.user);
        } else {
          return true;
        }
      },
      updateUser: function (data) {
        var d = $q.defer();

        $http.post(APP.apiPrefix + 'users/' + $auth.user.id + '/update_user', data)
          .success(function (data) {
            if (data.error) {
              exMsg.sweetAlert(data.message, (data.messages || []).join('\n'), 'error');
            } else {
              exMsg.sweetAlert('Great!', 'Account updated successfully', 'success');
            }
            d.resolve(data);
          }).catch(function (data) {
            exMsg.sweetAlert('Sorry!', 'Failed to update account', 'error');
            d.reject(data);
          });

        return d.promise;
      },
      showChangePassword: function () {
        exMsg.sweetAlert({
          title: 'Change Password',
          text: 'Current Password:',
          type: 'input',
          inputType: 'password',
          showCancelButton: true,
          closeOnConfirm: false,
          animation: 'slide-from-top',
          inputPlaceholder: 'Current Password'
        }, function(currentPassword) {
          if (currentPassword === false) return false;

          if (currentPassword === '') {
            exMsg.sweetAlert.showInputError('No password provided!');
            return false
          }

          exMsg.sweetAlert({
            title: 'Change Password',
            text: 'New Password:',
            type: 'input',
            inputType: 'password',
            showCancelButton: true,
            closeOnConfirm: false,
            animation: 'slide-from-top',
            inputPlaceholder: 'New Password'
          }, function(password) {
            if (password === false) return false;

            if (password === '') {
              exMsg.sweetAlert.showInputError('No password provided!');
              return false
            }

            exMsg.sweetAlert({
              title: 'Change Password',
              text: 'New Password Again:',
              type: 'input',
              inputType: 'password',
              showCancelButton: true,
              closeOnConfirm: false,
              animation: 'slide-from-top',
              inputPlaceholder: 'New Password Again'
            }, function(passwordConfirmation) {
              if (passwordConfirmation === false) return false;

              if (passwordConfirmation === '') {
                exMsg.sweetAlert.showInputError('No password provided!');
                return false
              }

              authSVC.updateUser({
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation
              });
            })
          });
        });
      }
    };
    
    return authSVC;
  });

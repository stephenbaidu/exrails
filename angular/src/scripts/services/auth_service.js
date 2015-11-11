'use strict';

/**
 * @ngdoc service
 * @name angularApp.authService
 * @description
 * # authService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('authService', function ($auth) {
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

        var found = _.find($auth.user.permissions, function (p) {
          return p === permission;
        });
        return (found === undefined)? false : true;
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
      }
    };
    
    return authSVC;
  });

'use strict';

/**
 * @ngdoc service
 * @name angularApp.formService
 * @description
 * # formService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('formService', function () {
    var forms = {};

    var formSVC = {
      get: function (modelInSnakeCase) {
        return angular.copy(forms[modelInSnakeCase]) || [];
      },
      set: function (modelInSnakeCase, formConfig) {
        forms[modelInSnakeCase] = formConfig;
      }
    };

    return formSVC;
  });

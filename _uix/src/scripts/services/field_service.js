'use strict';

/**
 * @ngdoc service
 * @name uixApp.fieldService
 * @description
 * # fieldService
 * Service in the uixApp.
 */
angular.module('uixApp')
  .service('fieldService', function () {
    var fields = {};

    var fieldSVC = {
      get: function (modelInSnakeCase) {
        return angular.copy(fields[modelInSnakeCase]) || [];
      },
      set: function (modelInSnakeCase, fieldConfig) {
        fields[modelInSnakeCase] = fieldConfig;
      }
    };
    
    return fieldSVC;
  });

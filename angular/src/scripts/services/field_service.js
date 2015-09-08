'use strict';

/**
 * @ngdoc service
 * @name angularApp.fieldService
 * @description
 * # fieldService
 * Service in the angularApp.
 */
angular.module('angularApp')
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

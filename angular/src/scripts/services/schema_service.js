'use strict';

/**
 * @ngdoc service
 * @name angularApp.schemaService
 * @description
 * # schemaService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('schemaService', function () {
    var schemas = {};

    var schemaSVC = {
      get: function (modelInSnakeCase) {
        return angular.copy(schemas[modelInSnakeCase]) || [];
      },
      set: function (modelInSnakeCase, schemaConfig) {
        schemas[modelInSnakeCase] = schemaConfig;
      }
    };
    window.s=schemaSVC
    return schemaSVC;
  });

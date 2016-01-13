'use strict';

/**
 * @ngdoc service
 * @name uixApp.schemaService
 * @description
 * # schemaService
 * Service in the uixApp.
 */
angular.module('uixApp')
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
    
    return schemaSVC;
  });

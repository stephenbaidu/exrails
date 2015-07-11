'use strict';

/**
 * @ngdoc service
 * @name angularApp.lookupService
 * @description
 * # lookupService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('lookupService', function (APP, $http) {
    var lookups = {};
    return {
      get: function (modelName, lookupName) {
        if (!lookups[modelName]) {
          this.load(modelName);
        }
        return lookups[modelName][lookupName];
      },
      load: function(modelName) {
        var url = APP.apiPrefix + 'lookups/' + modelName;
        return $http.get(url, { cache: true })
          .success(function (data) {
            lookups[modelName] = data;
            return data;
          });
      }
    }
  });

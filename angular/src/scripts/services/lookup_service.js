'use strict';

/**
 * @ngdoc service
 * @name angularApp.lookupService
 * @description
 * # lookupService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('lookupService', function (APP, $http, $q) {
    var lookups = {};
    var loadedModels = {};
    var lookupSVC = {
      get: function (lookupName, modelName) {
        if (modelName && !lookupSVC.loaded(modelName)) {
          this.load(modelName);
        }
        return lookups[lookupName] || [];
      },
      update: function (data, modelName) {
        if (modelName) {
          loadedModels[modelName] = true;
        }
        _.each(data, function (value, key) {
          lookups[key] = value;
        });
      },
      load: function (modelName, lookups, forceLoad) {
        var d = $q.defer();

        if (lookupSVC.loaded(modelName) && !forceLoad) {
          d.resolve(true);
        }

        var url = APP.apiPrefix + 'lookups/' + modelName;
        $http.get(url, {cache: true, params: { lookups: lookups } })
          .success(function (data) {
            lookupSVC.update(data, modelName);
            console.log();
            d.resolve(true);
          });
        
        return d.promise;
      },
      loaded: function (modelName) {
        return loadedModels[modelName];
      }
    };
    window.l = lookups;
    window.m = loadedModels;
    window.lookupSVC = lookupSVC;
    
    return lookupSVC;
  });

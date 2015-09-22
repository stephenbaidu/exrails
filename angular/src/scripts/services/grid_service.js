'use strict';

/**
 * @ngdoc service
 * @name angularApp.gridService
 * @description
 * # gridService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('gridService', function () {
    var grids = {};

    var gridSVC = {
      get: function (modelInSnakeCase) {
        return angular.copy(grids[modelInSnakeCase]) || [];
      },
      set: function (modelInSnakeCase, gridConfig) {
        grids[modelInSnakeCase] = gridConfig;
      }
    };

    return gridSVC;
  });
